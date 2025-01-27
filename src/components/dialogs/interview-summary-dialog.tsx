"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const { data: dox, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchAllInterviewSummariesByProjectId(projectId),
  });

  const interviews = Array.isArray(dox)
    ? dox.map((doc) => doc.content).join("\n")
    : "";

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["summary", projectId, interviews],
    queryFn: () => summarizeInterviews(interviews),
    enabled: isOpen && !!interviews,
  });



  useEffect(() => {
  const saveSummaryToProject = async (content: string) => {
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
      createDate: new Date().toLocaleDateString("eu-AU"),
      updateDate: new Date().toLocaleDateString("eu-AU"),
    };
    await saveDocToDb(newDocument, projectId);
  };


    if (summary) {
      console.log("Summary:", summary.message);
      saveSummaryToProject(summary.message);
      setIsOpen(false);
    }
  }, [summary, projectId,userId]);



  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Generate Interview Summary</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Generating Interview Summary</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoadingProject || isLoadingSummary ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin" />
              <span className="ml-2">Generating summary...</span>
            </div>
          ) : (
            <p>Summary generation complete. You can close this dialog.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
