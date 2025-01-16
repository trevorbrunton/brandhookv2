


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Project } from "@prisma/client";
import { fetchAllProjectsByUserId } from "@/app/actions/fetch-all-projects-by-userId";
import { ActionsButton } from "@/components/tables/actions-button";
import { NewProjectDialog } from "@/components/dialogs/new-project-details-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';

export async function ProjectTable() {




  const result = await fetchAllProjectsByUserId();
  if ('error' in result) {
    console.error("Error fetching projects:", result.error);
    return {
      error: `Failed to fetch projects: ${result.error}`,
    };
  }
  const projects = result as Project[];




  if (projects.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">No projects found</p>
          <NewProjectDialog />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
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
                  key={project.projectId}
                >
                  <TableCell className="py-4 px-4">
                  <div className="font-medium text-gray-900">
                    <Link href={`/project-view/${encodeURIComponent(project.projectId)}`}>
                      {project.projectName}
                      </Link>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 md:hidden">
                      {project.projectDetails}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 lg:hidden">
                      Created:
                      {new Date(project.createDate).toLocaleDateString()}
                      <br />
                      Updated:
                      {new Date(project.updateDate).toLocaleDateString()}
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
         
                      <ActionsButton projectId={project.projectId} />
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
