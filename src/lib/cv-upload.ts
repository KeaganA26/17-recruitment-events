import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client } from "@/lib/r2";

const MAX_CV_BYTES = 5 * 1024 * 1024;

export type CvExtension = "pdf" | "doc" | "docx";

const extensionByType: Record<string, CvExtension> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export function extensionFromName(name: string): CvExtension | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "pdf";
  if (lower.endsWith(".docx")) return "docx";
  if (lower.endsWith(".doc")) return "doc";
  return null;
}

export function looksLikeCv(bytes: Uint8Array, extension: CvExtension) {
  if (extension === "pdf") {
    return bytes.length > 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }
  if (extension === "docx") {
    return bytes.length > 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
  }
  return bytes.length > 8 && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0;
}

export function cvFieldError(file: FormDataEntryValue | null) {
  const upload = file instanceof File && file.size > 0 ? file : null;
  const extension = upload ? (extensionFromName(upload.name) ?? extensionByType[upload.type] ?? null) : null;
  const typedExtension = upload ? extensionByType[upload.type] : undefined;
  if (!upload || !extension) return "Attach a PDF or Word CV.";
  if (typedExtension && typedExtension !== extension) return "Attach a PDF or Word CV.";
  if (upload.size > MAX_CV_BYTES) return "CV must be 5MB or smaller.";
  return null;
}

export async function uploadPrivateCv(id: string, file: File) {
  const extension = extensionFromName(file.name) ?? extensionByType[file.type];
  if (!extension) throw new Error("CV type is not supported");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!looksLikeCv(bytes, extension)) return { error: "Attach a PDF or Word CV." as const };

  let r2: ReturnType<typeof createR2Client>;
  try {
    r2 = createR2Client();
  } catch {
    return { error: "unavailable" as const };
  }

  const cvKey = `applications/${id}/cv.${extension}`;
  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: cvKey,
        Body: bytes,
        ContentType: file.type || "application/octet-stream",
      }),
    );
  } catch (error) {
    console.error("CV upload failed", error instanceof Error ? error.name : "Error");
    return { error: "save" as const };
  }

  return {
    cvKey,
    remove: () =>
      r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: cvKey })).catch(() => undefined),
  };
}
