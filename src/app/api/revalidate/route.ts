import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookJob = {
  _type?: string;
  slug?: { current?: string } | string | null;
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing revalidate secret" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookJob>(request, secret, false);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
  if (body?._type !== "job" && body?._type !== "jobType") {
    return NextResponse.json({ revalidated: false });
  }

  revalidateTag("jobs", { expire: 0 });
  revalidateTag("job-types", { expire: 0 });
  revalidatePath("/");
  revalidatePath("/jobs");

  if (body._type === "jobType") {
    revalidatePath("/jobs", "layout");
    return NextResponse.json({ revalidated: true });
  }

  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  if (slug) revalidatePath(`/jobs/${slug}`);

  return NextResponse.json({ revalidated: true, slug: slug ?? null });
}
