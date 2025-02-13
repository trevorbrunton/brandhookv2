"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchAllInterviewSummariesByProjectId } from "@/app/actions/fetch-all-interview-summaries-by-projectId";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import type { ProjectDocument } from "@prisma/client";

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

export default function InterviewSummary() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const userId = searchParams.get("userId") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: dox } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchAllInterviewSummariesByProjectId(projectId),
  });

  console.log("dox", dox);

  const interviews = Array.isArray(dox)
    ? dox.map((doc) => doc.content).join("\n")
    : "";



  const { data: summary, refetch: refetchSummary } = useQuery({
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
        title: "All Interviews Summary",
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
      queryClient.invalidateQueries({ queryKey: ["documents", projectId] });
      router.push(`/project-view/${projectId}`);
    },
    onError: (error) => {
      console.error("Error saving summary:", error);
    },
  });

  useEffect(() => {
    const generateAndSaveSummary = async () => {
      if (interviews && !summary) {
        try {
          const result = await refetchSummary();
          if (result.data) {
            saveSummaryMutation.mutate(result.data.message);
          }
        } catch (error) {
          console.error("Error generating or saving summary:", error);
        }
      }
    };

    generateAndSaveSummary();
  }, [interviews, summary, refetchSummary, saveSummaryMutation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300 bg-opacity-90">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 py-2">
          <span>Generating Interview Summary</span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-4 p-4 min-h-56">
            <Brain className="animate-bounce text-primary" />
            <span className="text-gray-700">
              Hold on, this will take about a minute...
            </span>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
