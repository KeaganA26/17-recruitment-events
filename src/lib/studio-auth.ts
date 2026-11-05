import { projectId } from "@/sanity/env";

const userIdPattern = /^[A-Za-z0-9_-]{8,40}$/;

type ProjectMember = {
  id?: string;
  isRobot?: boolean;
};

let memberCache: { expiresAt: number; ids: Set<string> } | undefined;

async function projectMemberIds() {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token || !projectId) return null;
  if (memberCache && memberCache.expiresAt > Date.now()) return memberCache.ids;

  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const body = (await response.json()) as { members?: ProjectMember[] };
  const ids = new Set(
    (body.members ?? [])
      .filter((member) => member.isRobot !== true && typeof member.id === "string")
      .map((member) => member.id as string),
  );
  memberCache = { expiresAt: Date.now() + 30_000, ids };
  return ids;
}

async function bearerCanAccessProject(token: string) {
  if (!projectId) return false;
  const response = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return response.ok;
}

export async function hasProjectAccess(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";
  if (token) return bearerCanAccessProject(token);

  const userId = request.headers.get("x-sanity-user-id")?.trim() ?? "";
  if (!userIdPattern.test(userId)) return false;
  const ids = await projectMemberIds();
  return ids?.has(userId) ?? false;
}
