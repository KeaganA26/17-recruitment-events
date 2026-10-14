"use client";

import { useState } from "react";
import { ApplicationForm } from "@/components/ApplicationForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ApplyDialog({ jobTitle }: { jobTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="xl"
        className="w-full bg-brand-coral text-white hover:bg-brand-coral/90 sm:w-auto"
        onClick={() => setOpen(true)}
      >
        Apply Now
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-bold">
              Apply Now
            </DialogTitle>
            <DialogDescription>
              Complete the form below. Your CV is not uploaded in this demo.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm jobTitle={jobTitle} />
        </DialogContent>
      </Dialog>
    </>
  );
}
