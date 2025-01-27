"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchAllInterviewSummariesByProjectId } from "@/app/actions/fetch-all-interview-summaries-by-projectId";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import type { ProjectDocument } from "@prisma/client";

type InterviewSummaryDialogProps = {
  projectId: string;
  userId: string;
};

async function summarizeInterviews(interviews: string) {
  const response = await fetch("/api/summarise-interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviews }),
  });
  if (!response.ok) {
    throw new Error("Failed to summarize interviews");
  }
  return response.json();
}

export function InterviewSummaryDialog({
  projectId,
  userId,
}: InterviewSummaryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasGeneratedSummary = useRef(false);

  const {
    data: dox,
    isLoading: isLoadingProject,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchAllInterviewSummariesByProjectId(projectId),
  });

  const interviews = Array.isArray(dox)
    ? dox.map((doc) => doc.content).join("\n")
    : "";

  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["summary", projectId, interviews],
    queryFn: () => summarizeInterviews(interviews),
    enabled: false, // We'll manually trigger this query
  });

  const saveSummaryMutation = useMutation({
    mutationFn: async (content: string) => {
      const newDocument: ProjectDocument = {
        id: "",
        projectId,
        userId,
        title: "Project Summary",
        interviewee: "",
        interviewDate: "",
        content: content,
        fileUrl: "",
        docType: "project-summary",
        createDate: new Date().toLocaleString("en-AU"),
        updateDate: new Date().toLocaleString("en-AU"),
      };
      await saveDocToDb(newDocument, projectId);
    },
    onSuccess: () => {
      console.log("Summary saved successfully");
      setIsOpen(false);
      hasGeneratedSummary.current = false; // Reset the flag
    },
    onError: (error) => {
      console.error("Error saving summary:", error);
      hasGeneratedSummary.current = false; // Reset the flag on error
    },
  });

  useEffect(() => {
    const generateAndSaveSummary = async () => {
      if (isOpen && interviews && !summary && !hasGeneratedSummary.current) {
        hasGeneratedSummary.current = true; // Set the flag to prevent double invocation
        try {
          const result = await refetchSummary();
          if (result.data) {
            console.log("Summary:", result.data.message);
            saveSummaryMutation.mutate(result.data.message);
          }
        } catch (error) {
          console.error("Error generating or saving summary:", error);
          hasGeneratedSummary.current = false; // Reset the flag on error
        }
      }
    };

    generateAndSaveSummary();
  }, [isOpen, interviews, summary, refetchSummary, saveSummaryMutation]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newIsOpen) => {
        setIsOpen(newIsOpen);
        if (!newIsOpen) {
          hasGeneratedSummary.current = false; // Reset the flag when dialog is closed
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Generate Interview Summary</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generating Interview Summary</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoadingProject ||
          isLoadingSummary ||
          saveSummaryMutation.status === 'pending' ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin" />
              <span className="ml-2">Generating summary...</span>
            </div>
          ) : projectError || summaryError || saveSummaryMutation.isError ? (
            <p className="text-red-500">
              Error:{" "}
              {(
                projectError ||
                summaryError ||
                (saveSummaryMutation.error as Error)
              )?.message || "An error occurred"}
            </p>
          ) : summary ? (
            <p>Summary generation complete. You can close this dialog.</p>
          ) : (
            <p>Preparing to generate summary...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
