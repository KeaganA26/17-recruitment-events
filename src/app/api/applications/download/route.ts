import { GetObjectCommand } from "@aws-sdk/client-s3";
import { zipSync } from "fflate";
import { NextResponse } from "next/server";
import {
  applicationIdPattern,
  privateCvKeyPattern,
  uniqueCvDownloadName,
} from "@/lib/cv-file";
import { getApplications } from "@/lib/db";
import { createR2Client } from "@/lib/r2";
import { hasProjectAccess } from "@/lib/studio-auth";

export const runtime = "nodejs";

const maxSelection = 25;

export async function POST(request: Request) {
  if (!(await hasProjectAccess(request))) {
    return NextResponse.json(
      { error: "Sign in to Sanity to review applications." },
      { status: 401 },
    );
  }

  let ids: unknown;
  try {
    const body = (await request.json()) as { ids?: unknown };
    ids = body.ids;
  } catch {
    return NextResponse.json({ error: "Select at least one application." }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Select at least one application." }, { status: 400 });
  }
  if (ids.length > maxSelection) {
    return NextResponse.json(
      { error: "Select 25 applications or fewer." },
      { status: 400 },
    );
  }
  if (!ids.every((id) => applicationIdPattern.test(id))) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const applications = await getApplications(ids);
  if (applications.length !== ids.length) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
  if (applications.some((application) => !privateCvKeyPattern.test(application.cvUrl))) {
    return NextResponse.json({ error: "A selected CV could not be downloaded." }, { status: 404 });
  }

  let r2: ReturnType<typeof createR2Client>;
  try {
    r2 = createR2Client();
  } catch {
    return NextResponse.json(
      { error: "The CVs could not be downloaded." },
      { status: 500 },
    );
  }

  const files: Record<string, Uint8Array> = {};
  const usedNames = new Set<string>();

  try {
    for (const application of applications) {
      const object = await r2.client.send(
        new GetObjectCommand({ Bucket: r2.bucket, Key: application.cvUrl }),
      );
      const bytes = await object.Body?.transformToByteArray();
      if (!bytes) {
        return NextResponse.json(
          { error: "A selected CV could not be downloaded." },
          { status: 404 },
        );
      }
      const extension = application.cvUrl.split(".").pop()?.toLowerCase() ?? "pdf";
      const name = uniqueCvDownloadName(
        application.firstName,
        application.lastName,
        extension,
        application.id,
        usedNames,
      );
      files[name] = bytes;
    }
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    if (name === "NoSuchKey" || name === "NotFound") {
      return NextResponse.json(
        { error: "A selected CV could not be downloaded." },
        { status: 404 },
      );
    }
    console.error("CV zip failed", name);
    return NextResponse.json(
      { error: "The CVs could not be downloaded." },
      { status: 500 },
    );
  }

  const zip = zipSync(files);
  return new NextResponse(Buffer.from(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="applications.zip"',
      "Cache-Control": "private, no-store",
    },
  });
}
