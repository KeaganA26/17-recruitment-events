export const applicationIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const privateCvKeyPattern =
  /^applications\/[0-9a-f-]{36}\/cv\.(pdf|doc|docx)$/i;

export function cvDownloadName(firstName: string, lastName: string, extension: string) {
  const base = `${firstName}-${lastName}-cv`
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "cv"}.${extension}`;
}

export function uniqueCvDownloadName(
  firstName: string,
  lastName: string,
  extension: string,
  id: string,
  used: Set<string>,
) {
  let name = cvDownloadName(firstName, lastName, extension);
  if (used.has(name)) {
    name = name.replace(/(\.[^.]+)$/, `-${id.slice(0, 8)}$1`);
  }
  used.add(name);
  return name;
}
