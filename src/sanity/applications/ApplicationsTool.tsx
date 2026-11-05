"use client";

import { Box, Button, Card, Checkbox, Flex, Select, Spinner, Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { definePlugin, useClient, type SanityClient } from "sanity";
import { apiVersion, projectId } from "@/sanity/env";

type SubmissionKind = "job" | "talent" | "employer" | "contact";

type SubmissionDetails = {
  role?: string;
  experience?: string;
  availability?: string;
  company?: string;
  eventDate?: string;
  location?: string;
  staffCount?: string;
  staffType?: string;
  subject?: string;
};

type ApplicationSummary = {
  id: string;
  kind: SubmissionKind;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string;
  createdAt: string;
  hasCv: boolean;
  details: SubmissionDetails;
};

const kindLabel: Record<SubmissionKind, string> = {
  job: "Job application",
  talent: "Talent network",
  employer: "Employer request",
  contact: "Contact message",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type SortOrder = "newest" | "oldest" | "name" | "name-desc" | "job";

function matchesSearch(application: ApplicationSummary, query: string) {
  if (!query) return true;
  const haystack = [
    application.firstName,
    application.lastName,
    application.email,
    application.mobile,
    application.city,
    application.region,
    application.jobTitle,
    application.message,
    kindLabel[application.kind] ?? "",
    ...Object.values(application.details ?? {}),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function compareApplications(order: SortOrder) {
  return (left: ApplicationSummary, right: ApplicationSummary) => {
    if (order === "oldest") {
      return left.createdAt.localeCompare(right.createdAt);
    }
    if (order === "name" || order === "name-desc") {
      const byName = `${left.firstName} ${left.lastName}`.localeCompare(
        `${right.firstName} ${right.lastName}`,
        "en",
        { sensitivity: "base" },
      );
      return order === "name" ? byName : -byName;
    }
    if (order === "job") {
      return left.jobTitle.localeCompare(right.jobTitle, "en", { sensitivity: "base" });
    }
    return right.createdAt.localeCompare(left.createdAt);
  };
}

function storedStudioToken() {
  if (!projectId) return "";
  try {
    const raw = window.localStorage.getItem(`__studio_auth_token_${projectId}`);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { token?: unknown };
    return typeof parsed.token === "string" ? parsed.token : "";
  } catch {
    return "";
  }
}

async function reviewHeaders(client: SanityClient): Promise<HeadersInit | null> {
  const token = client.config().token || storedStudioToken();
  if (token) return { Authorization: `Bearer ${token}` };

  try {
    const user = await client.withConfig({ withCredentials: true }).request<{ id?: string }>({
      url: "/users/me",
    });
    return user?.id ? { "X-Sanity-User-Id": user.id } : null;
  } catch {
    return null;
  }
}

function ApplicationsTool() {
  const client = useClient({ apiVersion });
  const [applications, setApplications] = useState<ApplicationSummary[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState("");
  const [downloadingSelected, setDownloadingSelected] = useState(false);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [kind, setKind] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const loadApplications = useCallback(async () => {
    const headers = await reviewHeaders(client);
    if (!headers) {
      setApplications(null);
      setError("Sign in to Sanity to review applications.");
      return;
    }

    setError("");
    const response = await fetch("/api/applications", {
      headers,
      cache: "no-store",
    });
    const body = (await response.json()) as {
      applications?: ApplicationSummary[];
      error?: string;
    };
    if (!response.ok || !body.applications) {
      setApplications(null);
      setError(body.error || "Applications could not be loaded.");
      return;
    }
    setApplications(body.applications);
    setSelectedIds((current) =>
      current.filter((id) => body.applications?.some((application) => application.id === id)),
    );
  }, [client]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadApplications().catch(() => {
        setError("Applications could not be loaded.");
      });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadApplications]);

  function toggleApplication(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  const roles = useMemo(
    () => [...new Set(applications?.map((application) => application.jobTitle) ?? [])].sort(),
    [applications],
  );
  const regions = useMemo(
    () =>
      [...new Set(applications?.map((application) => application.region).filter(Boolean) ?? [])].sort(),
    [applications],
  );
  const visibleApplications = useMemo(() => {
    const search = query.trim().toLowerCase();
    return (applications ?? [])
      .filter((application) => {
        if (kind && application.kind !== kind) return false;
        if (role && application.jobTitle !== role) return false;
        if (region && application.region !== region) return false;
        return matchesSearch(application, search);
      })
      .sort(compareApplications(sortOrder));
  }, [applications, kind, query, region, role, sortOrder]);

  function toggleAll() {
    const visibleIds = visibleApplications
      .filter((application) => application.hasCv)
      .map((application) => application.id);
    const everySelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds((current) =>
      everySelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current, ...visibleIds])],
    );
  }

  async function saveDownload(response: Response, fallbackName: string) {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const match = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/);
    anchor.href = url;
    anchor.download = match?.[1] || fallbackName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function downloadSelected() {
    const headers = await reviewHeaders(client);
    if (!headers || selectedIds.length === 0) return;
    setDownloadingSelected(true);
    setError("");
    try {
      const response = await fetch("/api/applications/download", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error || "The CVs could not be downloaded.");
        return;
      }
      await saveDownload(response, "applications.zip");
    } catch {
      setError("The CVs could not be downloaded.");
    } finally {
      setDownloadingSelected(false);
    }
  }

  async function downloadCv(application: ApplicationSummary) {
    const headers = await reviewHeaders(client);
    if (!headers) return;
    setDownloadingId(application.id);
    setError("");
    try {
      const response = await fetch(`/api/applications/${application.id}/cv`, {
        headers,
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error || "The CV could not be downloaded.");
        return;
      }
      await saveDownload(response, "cv");
    } catch {
      setError("The CV could not be downloaded.");
    } finally {
      setDownloadingId("");
    }
  }

  return (
    <Box padding={4} sizing="border" style={{ overflow: "auto", height: "100%" }}>
      <Stack gap={4}>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={3} weight="semibold">
            Applications
          </Text>
          {applications && applications.length > 0 ? (
            <Button
              text={
                downloadingSelected
                  ? "Downloading"
                  : `Download selected${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`
              }
              disabled={selectedIds.length === 0 || downloadingSelected || Boolean(downloadingId)}
              onClick={() => void downloadSelected()}
            />
          ) : null}
        </Flex>
        {error ? <Text size={1}>{error}</Text> : null}
        {applications === null && !error ? <Spinner muted /> : null}
        {applications?.length === 0 ? <Text size={1}>No applications yet.</Text> : null}
        {applications && applications.length > 0 ? (
          <Stack gap={3}>
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search name, email, city, or role"
              aria-label="Search applications"
            />
            <Flex align="center" gap={3} style={{ flexWrap: "wrap" }}>
              <Select
                value={kind}
                onChange={(event) => setKind(event.currentTarget.value)}
                aria-label="Filter by type"
              >
                <option value="">All types</option>
                <option value="job">Job applications</option>
                <option value="talent">Talent network</option>
                <option value="employer">Employer requests</option>
                <option value="contact">Contact messages</option>
              </Select>
              <Select
                value={role}
                onChange={(event) => setRole(event.currentTarget.value)}
                aria-label="Filter by role"
              >
                <option value="">All roles</option>
                {roles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                value={region}
                onChange={(event) => setRegion(event.currentTarget.value)}
                aria-label="Filter by region"
              >
                <option value="">All regions</option>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.currentTarget.value as SortOrder)}
                aria-label="Sort applications"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="job">Role A–Z</option>
              </Select>
            </Flex>
          </Stack>
        ) : null}
        {applications && applications.length > 0 ? (
          <Flex align="center" gap={3}>
            <Checkbox
              checked={
                visibleApplications.some((application) => application.hasCv) &&
                visibleApplications
                  .filter((application) => application.hasCv)
                  .every((application) => selectedIds.includes(application.id))
              }
              indeterminate={
                visibleApplications.some(
                  (application) => application.hasCv && selectedIds.includes(application.id),
                ) &&
                !visibleApplications
                  .filter((application) => application.hasCv)
                  .every((application) => selectedIds.includes(application.id))
              }
              onChange={toggleAll}
              aria-label="Select shown applications"
              disabled={!visibleApplications.some((application) => application.hasCv)}
            />
            <Text size={1}>
              {visibleApplications.length === applications.length ? "Select all" : "Select shown"}
            </Text>
          </Flex>
        ) : null}
        {applications && applications.length > 0 && visibleApplications.length === 0 ? (
          <Text size={1}>No applications match.</Text>
        ) : null}
        {visibleApplications.map((application) => (
          <Card key={application.id} padding={4} radius={2} shadow={1}>
            <Stack gap={4}>
              <Flex align="flex-start" gap={3}>
                <Checkbox
                  checked={selectedIds.includes(application.id)}
                  disabled={!application.hasCv}
                  onChange={() => toggleApplication(application.id)}
                  aria-label={`Select ${application.firstName} ${application.lastName}`}
                />
                <Stack gap={2}>
                  <Text weight="semibold">
                    {application.firstName} {application.lastName}
                  </Text>
                  <Text size={1} muted>
                    {kindLabel[application.kind] ?? "Submission"}
                    {application.jobTitle ? ` · ${application.jobTitle}` : ""} ·{" "}
                    {dateFormat.format(new Date(application.createdAt))}
                  </Text>
                </Stack>
              </Flex>
              <Text size={1}>
                {application.email}
                {application.mobile ? (
                  <>
                    <br />
                    {application.mobile}
                  </>
                ) : null}
              </Text>
              {application.city || application.region ? (
                <Text size={1}>
                  {[application.city, application.region].filter(Boolean).join(", ")}
                </Text>
              ) : null}
              {application.details?.company ? <Text size={1}>{application.details.company}</Text> : null}
              {application.details?.eventDate || application.details?.location ? (
                <Text size={1}>
                  {[application.details.eventDate, application.details.location].filter(Boolean).join(" · ")}
                </Text>
              ) : null}
              {application.details?.staffCount ? (
                <Text size={1}>{application.details.staffCount} staff</Text>
              ) : null}
              {application.details?.availability ? (
                <Text size={1}>{application.details.availability}</Text>
              ) : null}
              {application.message ? <Text size={1}>{application.message}</Text> : null}
              {application.hasCv ? (
                <Flex>
                  <Button
                    text={downloadingId === application.id ? "Downloading" : "Download CV"}
                    disabled={downloadingId === application.id || downloadingSelected}
                    onClick={() => void downloadCv(application)}
                  />
                </Flex>
              ) : null}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}

export const applicationsTool = definePlugin({
  name: "applications-review",
  tools: [
    {
      name: "applications",
      title: "Applications",
      component: ApplicationsTool,
    },
  ],
});
