"use client";
import { useState } from "react";
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
import { LoadingSpinner } from "../loading-spinner";
import { useEffect } from "react";
import { getAllJobs } from "@/app/actions/get-all-jobs";

async function fetchDocuments(
  projectId: string
): Promise<ProjectDocument[] | null> {
  console.log("fetching documents for project", projectId);
  const response = await fetchAllDocumentsByProjectId(projectId);
  console.log("response", response);
  return response.documents ?? null;
}

async function fetchAllJobs(projectId: string): Promise<JobQueue[] | null> {
  const jobs = await getAllJobs(projectId);
  console.log("jobs fetched", jobs);
  return jobs
}

export function DocumentTable({ project }: { project: Project }) {
  const [pendingJobs, setPendingJobs] = useState(false);
  console.log("project prop", project);
  const queryClient = useQueryClient();

  const {
    data: documents,
    isLoading: isLoadingDocs,
    error: docsError,
  } = useQuery<ProjectDocument[] | null, Error>({
    queryKey: ["documents", project.id],
    queryFn: () => fetchDocuments(project.id),
  });

  const { data: jobs, error: jobsError } = useQuery<JobQueue[] | null, Error>({
    queryKey: ["jobs", project.id],
    queryFn: () => fetchAllJobs(project.id),
    refetchInterval: 120000, // Refetch every 2 minutes
  });

  useEffect(() => {
    if (jobs && Array.isArray(jobs)) {
      const hasCompletedJobs = jobs.some(
        (job) => job.jobStatus === "COMPLETED"
      );
      const hasPendingJobs = jobs.some((job) => job.jobStatus === "PENDING");

      if (hasCompletedJobs) {
        console.log("Completed jobs found, refreshing documents");
        queryClient.invalidateQueries({ queryKey: ["documents", project.id] });
      }

      if (!hasPendingJobs) {
        console.log("No pending jobs remaining");
        setPendingJobs(false);
      } else {
        console.log("Pending jobs still exist");
        setPendingJobs(true);
      }
    }
  }, [jobs, project.id, queryClient]);

  if (isLoadingDocs) {
    return (
      <div className="flex justify-center mt-12">
        <LoadingSpinner message="Loading Documents..." />
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="flex justify-center mt-12">
        Error loading documents: {docsError.message}
      </div>
    );
  }

  if (jobsError) {
    console.error("Error fetching jobs:", jobsError);
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex justify-center mt-12">No Documents available</div>
    );
  }

  return (
    <>
      {pendingJobs && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
          <p className="font-bold">Pending Jobs</p>
          <p className="text-sm">
            There are pending jobs for this project. They will be added when complete
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
