"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchAllInterviewSummariesByProjectId } from "@/app/actions/fetch-all-interview-summaries-by-projectId";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import type { ProjectDocument } from "@prisma/client";
// import { DocumentContent } from "@/components/document-content";
import Markdown from "react-markdown";

async function summarizeInterviews(interviews: string) {
  const response = await fetch("/api/summarise-interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviews }),
  });

  if (!response.ok) {
    throw new Error("Failed to summarize interviews");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get response reader");
  }

  return reader;
}

export default function InterviewSummary() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const userId = searchParams.get("userId") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: dox } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchAllInterviewSummariesByProjectId(projectId),
  });

  const interviews = Array.isArray(dox)
    ? dox.map((doc) => doc.content).join("\n")
    : "";

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
      if (interviews && !isGenerating) {
        setIsGenerating(true);
        try {
          const reader = await summarizeInterviews(interviews);
          const decoder = new TextDecoder();
          let accumulatedSummary = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            accumulatedSummary += chunk;
            setSummary(accumulatedSummary);
          }

          saveSummaryMutation.mutate(accumulatedSummary);
        } catch (error) {
          console.error("Error generating or saving summary:", error);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    generateAndSaveSummary();
  }, [interviews, saveSummaryMutation, isGenerating]); // Added isGenerating to dependencies

  // const dummyDocument: ProjectDocument = {
  //   id: "dummy",
  //   projectId,
  //   userId,
  //   title: "All Interviews Summary (In Progress)",
  //   interviewee: "",
  //   interviewDate: "",
  //   content: summary,
  //   fileUrl: "",
  //   docType: "project-summary",
  //   createDate: new Date().toLocaleString("en-AU"),
  //   updateDate: new Date().toLocaleString("en-AU"),
  // };

  return (
    <div className="min-h-screen bg-gray-300 bg-opacity-90 p-4">
      <div className="w-1/3 min-h-42 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 py-2">
          <span>Generating Interview Summary</span>
        </div>
        <div className="mt-4">
          {isGenerating && (
            <div className="flex items-center justify-center space-x-4 p-4">
              <Brain className="animate-bounce text-primary" />
              <span className="text-gray-700">
                Generating summary, please wait...
              </span>
            </div>
          )}
          {/* <DocumentContent document={dummyDocument} /> */}
                <div className="prose-sm max-h-96 overflow-y-auto p-4" ref={(el) => {
                  if (el) {
                  el.scrollTop = el.scrollHeight;
                  }
                }}>
                  <Markdown>{summary}</Markdown>
                </div>
        </div>
      </div>
    </div>
  );
}
