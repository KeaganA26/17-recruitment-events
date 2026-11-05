"use client";

import { Box, Button, Card, Checkbox, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { definePlugin, useClient } from "sanity";
import { apiVersion } from "@/sanity/env";

type ApplicationSummary = {
  id: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  region: string;
  message: string;
  createdAt: string;
};

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function ApplicationsTool() {
  const client = useClient({ apiVersion });
  const token = client.config().token;
  const [applications, setApplications] = useState<ApplicationSummary[] | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState("");
  const [downloadingSelected, setDownloadingSelected] = useState(false);

  const loadApplications = useCallback(async () => {
    if (!token) {
      setApplications(null);
      setError("Sign in to Sanity to review applications.");
      return;
    }

    setError("");
    const response = await fetch("/api/applications", {
      headers: { Authorization: `Bearer ${token}` },
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
  }, [token]);

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

  function toggleAll() {
    if (!applications) return;
    const everySelected = applications.every((application) => selectedIds.includes(application.id));
    setSelectedIds(everySelected ? [] : applications.map((application) => application.id));
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
    if (!token || selectedIds.length === 0) return;
    setDownloadingSelected(true);
    setError("");
    try {
      const response = await fetch("/api/applications/download", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
    if (!token) return;
    setDownloadingId(application.id);
    setError("");
    try {
      const response = await fetch(`/api/applications/${application.id}/cv`, {
        headers: { Authorization: `Bearer ${token}` },
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
          <Flex align="center" gap={3}>
            <Checkbox
              checked={applications.every((application) => selectedIds.includes(application.id))}
              indeterminate={
                selectedIds.length > 0 &&
                !applications.every((application) => selectedIds.includes(application.id))
              }
              onChange={toggleAll}
              aria-label="Select all applications"
            />
            <Text size={1}>Select all</Text>
          </Flex>
        ) : null}
        {applications?.map((application) => (
          <Card key={application.id} padding={4} radius={2} shadow={1}>
            <Stack gap={4}>
              <Flex align="flex-start" gap={3}>
                <Checkbox
                  checked={selectedIds.includes(application.id)}
                  onChange={() => toggleApplication(application.id)}
                  aria-label={`Select ${application.firstName} ${application.lastName}`}
                />
                <Stack gap={2}>
                  <Text weight="semibold">
                    {application.firstName} {application.lastName}
                  </Text>
                  <Text size={1} muted>
                    {application.jobTitle} · {dateFormat.format(new Date(application.createdAt))}
                  </Text>
                </Stack>
              </Flex>
              <Text size={1}>
                {application.email}
                <br />
                {application.mobile}
              </Text>
              <Text size={1}>
                {application.city}, {application.region}
              </Text>
              {application.message ? <Text size={1}>{application.message}</Text> : null}
              <Flex>
                <Button
                  text={downloadingId === application.id ? "Downloading" : "Download CV"}
                  disabled={downloadingId === application.id || downloadingSelected}
                  onClick={() => void downloadCv(application)}
                />
              </Flex>
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
