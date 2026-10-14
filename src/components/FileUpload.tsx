"use client";

import { useId, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  label: string;
  required?: boolean;
  error?: string;
  onFileChange: (file: File | null) => void;
};

export function FileUpload({
  label,
  required,
  error,
  onFileChange,
}: FileUploadProps) {
  const id = useId();
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-brand-coral"> *</span> : null}
      </Label>
      <label
        htmlFor={id}
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-white px-4 py-5 text-center transition-colors hover:border-brand-coral/50 hover:bg-brand-mist",
          error && "border-destructive"
        )}
      >
        <Upload className="size-5 text-brand-coral" aria-hidden="true" />
        <span className="mt-2 text-sm font-medium">
          Tap to attach your CV
        </span>
        <span className="mt-1 text-xs text-muted-foreground">
          PDF or Word, max 5MB. Files stay on this device for the demo.
        </span>
        <input
          id={id}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(event) => {
            const next = event.target.files?.[0] ?? null;
            setFile(next);
            onFileChange(next);
          }}
        />
      </label>
      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-brand-mist px-3 py-2">
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <FileText className="size-4 shrink-0 text-brand-coral" />
            <span className="truncate">{file.name}</span>
          </div>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg hover:bg-white"
            aria-label="Remove file"
            onClick={() => {
              setFile(null);
              onFileChange(null);
            }}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
