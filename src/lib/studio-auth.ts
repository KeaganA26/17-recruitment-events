import { projectId } from "@/sanity/env";

export async function hasProjectAccess(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (!token || !projectId) return false;

  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return response.ok;
}
