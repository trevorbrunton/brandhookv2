"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DocActionsButton } from "@/components/tables/doc-actions-button";
import type { Project, ProjectDocument, JobQueue } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fetchAllDocumentsByProjectId } from "@/app/actions/fetch-all-documents-by-projectId";
import { deleteCompletedJobs } from "@/app/actions/delete-completed-jobs";
import { LoadingSpinner } from "../loading-spinner";
import { getAllJobs } from "@/app/actions/get-all-jobs";

const POLLING_INTERVAL = 60000; // 1 minute

async function fetchDocuments(
  projectId: string
): Promise<ProjectDocument[] | null> {
  try {
    const response = await fetchAllDocumentsByProjectId(projectId);
    return response.documents ?? null;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return null;
  }
}

async function fetchAllJobs(projectId: string): Promise<JobQueue[] | null> {
  try {
    return await getAllJobs(projectId);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return null;
  }
}

export function DocumentTable({ project }: { project: Project }) {
  const [hasPendingJobs, setHasPendingJobs] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading: isLoadingDocs,
    error: docsError,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["documents", project.id],
    queryFn: () => fetchDocuments(project.id),
    // staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const {
    data: jobs,
    error: jobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["jobs", project.id],
    queryFn: () => fetchAllJobs(project.id),
    refetchInterval: POLLING_INTERVAL,
  });

  useEffect(() => {
    if (!jobs || !Array.isArray(jobs)) return;

    const completedJobs = jobs.filter((job) => job.jobStatus === "COMPLETE");
    const pendingJobs = jobs.filter((job) => job.jobStatus === "PENDING");

    setHasPendingJobs(pendingJobs.length > 0);

    if (completedJobs.length > 0) {
      console.log("Completed jobs found, refreshing documents...");
      refetchDocuments();

      // Delete completed jobs in bulk
      deleteCompletedJobs(completedJobs.map((job) => job.id))
        .then(() => {
          console.log("Completed jobs deleted.");
          refetchJobs(); // Refresh job list after deletion
        })
        .catch((error) =>
          console.error("Error deleting completed jobs:", error)
      );
      queryClient.invalidateQueries({ queryKey: ["documents", project.id] });
    }
  }, [jobs, refetchDocuments, refetchJobs, project.id, queryClient]);

  if (isLoadingDocs) {
    return (
      <div className="flex justify-center mt-12">
        <LoadingSpinner message="Loading Documents..." />
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="flex justify-center mt-12 text-red-600">
        Error loading documents: {docsError.message}
      </div>
    );
  }

  if (jobsError) {
    console.error("Error fetching jobs:", jobsError);
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex justify-center mt-12 text-gray-500">
        No Documents available
      </div>
    );
  }

  return (
    <>
      {hasPendingJobs && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4">
          <p className="font-bold text-xs">Pending Results</p>
          <p className="text-xs">
            There are documents that are still processing. They will be added when
            complete. You can navigate away from this page and return later if you wish.
          </p>
        </div>
      )}
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="text-right">View</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow key={document.id}>
              <TableCell className="font-medium">{document.title}</TableCell>
              <TableCell>
                {new Date(document.createDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild>
                  <Link href={`/document-viewer/${document.id}`}>View</Link>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <DocActionsButton
                  projectId={project.id}
                  documentId={document.id}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
