"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { fetchAllWowsByProjectId } from "@/app/actions/fetch-all-wows-by-projectId";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import type { ProjectDocument } from "@prisma/client";

async function summarizeWowMoments(wows: string) {
  const response = await fetch("/api/summarise-wows", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wows }),
  });
  if (!response.ok) {
    throw new Error("Failed to summarize interviews");
  }
  return response.json();
}

export default function WowMomentSummary() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") || "";
  const userId = searchParams.get("userId") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: dox } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchAllWowsByProjectId(projectId),
  });

  console.log("dox", dox);

  const wows = Array.isArray(dox)
    ? dox.map((doc) => doc.content).join("\n")
    : "";

  console.log("wows", wows);

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ["summary", projectId, wows],
    queryFn: () => summarizeWowMoments(wows),
    enabled: false, // We'll manually trigger this query
  });

  const saveSummaryMutation = useMutation({
    mutationFn: async (content: string) => {
      const newDocument: ProjectDocument = {
        id: "",
        projectId,
        userId,
        title: "Wow Moments Summary",
        interviewee: "",
        interviewDate: "",
        content: content,
        fileUrl: "",
        docType: "wow-moments-summary",
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
      if (wows && !summary) {
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
  }, [wows, summary, refetchSummary, saveSummaryMutation]);

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
              Hold on, just thinking a bit...
            </span>
          </div>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
