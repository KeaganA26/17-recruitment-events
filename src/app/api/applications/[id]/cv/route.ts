import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { applicationIdPattern, cvDownloadName, privateCvKeyPattern } from "@/lib/cv-file";
import { getApplication } from "@/lib/db";
import { createR2Client } from "@/lib/r2";
import { hasProjectAccess } from "@/lib/studio-auth";

export const runtime = "nodejs";

const contentTypeByExtension: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await hasProjectAccess(request))) {
    return NextResponse.json(
      { error: "Sign in to Sanity to review applications." },
      { status: 401 },
    );
  }

  const { id } = await params;
  if (!applicationIdPattern.test(id)) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const application = await getApplication(id);
  if (!application || !privateCvKeyPattern.test(application.cvUrl)) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const extension = application.cvUrl.split(".").pop()?.toLowerCase() ?? "pdf";
  let r2: ReturnType<typeof createR2Client>;
  try {
    r2 = createR2Client();
  } catch {
    return NextResponse.json(
      { error: "The CV could not be downloaded." },
      { status: 500 },
    );
  }

  try {
    const object = await r2.client.send(
      new GetObjectCommand({ Bucket: r2.bucket, Key: application.cvUrl }),
    );
    const bytes = await object.Body?.transformToByteArray();
    if (!bytes) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    const fileName = cvDownloadName(application.firstName, application.lastName, extension);
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": contentTypeByExtension[extension] ?? "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "Error";
    if (name === "NoSuchKey" || name === "NotFound") {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }
    console.error("CV download failed", name);
    return NextResponse.json(
      { error: "The CV could not be downloaded." },
      { status: 500 },
    );
  }
}
