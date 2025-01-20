"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Project } from "@prisma/client";
import { fetchAllProjectsByUserId } from "@/app/actions/fetch-all-projects-by-userId";
import { ActionsButton } from "@/components/tables/actions-button";
import { NewProjectDialog } from "@/components/dialogs/new-project-details-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import Link from "next/link";

export function ProjectTable() {
  const {
    data: projects,
    isLoading,
    isError,
    error,
  } = useQuery<Project[], Error>({
    queryKey: ["all_projects"],
    queryFn: async () => {
      const result = await fetchAllProjectsByUserId();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  if (isLoading) {
    return (
      <div className="mt-20">
        <LoadingSpinner size="md" message="Loading projects..." />
      </div>
    );
  }

  if (isError) {
    return (
      <span>An error occurred while fetching projects. {error.message}</span>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className="m-20">
        <CardHeader />
        <CardContent className="text-center">
          <p className="mb-6">You have no projects yet</p>
          <NewProjectDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[250px] py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                Project Name
              </TableHead>
              <TableHead className="hidden py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 md:table-cell">
                Description
              </TableHead>
              <TableHead className="hidden py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 lg:table-cell">
                Date Created
              </TableHead>
              <TableHead className="hidden py-3 px-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500 lg:table-cell">
                Last Updated
              </TableHead>
              <TableHead className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                className="border-b border-gray-200 last:border-b-0"
                key={project.id}
              >
                <TableCell className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    <Link
                      href={{
                        pathname: `/project-view/${project.id}`,
                        query: { project: JSON.stringify(project) },
                      }}
                      as={`/project-view/${project.id}`}
                    >
                      {project.projectName}
                    </Link>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 md:hidden">
                    {project.projectDetails}
                  </div>
                  <div className="mt-1 text-xs text-gray-400 lg:hidden">
                    Created:
                    {project.createDate}
                    <br />
                    Updated:
                    {project.updateDate}
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-[300px] truncate py-4 px-4 md:table-cell">
                  {project.projectDetails}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap py-4 px-4 text-sm text-gray-500 lg:table-cell">
                  {project.createDate}
                </TableCell>
                <TableCell className="hidden whitespace-nowrap py-4 px-4 text-sm text-gray-500 lg:table-cell">
                  {project.updateDate}
                </TableCell>
                <TableCell className="whitespace-nowrap py-4 px-4 text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <ActionsButton
                      projectId={project.id}
                      projectName={project.projectName}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
