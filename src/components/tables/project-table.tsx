import React from "react";

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
// import { SelectButton } from "@/app/dashboard/select-button";
// import { ActionsButton } from "@/app/dashboard/actions-button";


export async function ProjectTable() {
  const projects = await fetchAllProjectsByUserId();
  if (!projects) {
    console.error("failed to fetch projects");
  }


  return (
    <Table className="w-full">
      <TableHeader className="bg-gray-100">
        <TableRow className="hidden sm:table-row">
          <TableHead>Project Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="text-right">Select</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(projects) && projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              No projects found
            </TableCell>
          </TableRow>
        ) : (
          
            Array.isArray(projects) && projects.map((project: Project) => (
              <React.Fragment key={project.projectId}>
                <TableRow className="hidden sm:table-row">
                  <TableCell className="font-medium">
                    {project.projectName}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {project.projectDetails}
                  </TableCell>
                  <TableCell>{project.createDate}</TableCell>
                  <TableCell>{project.updateDate}</TableCell>
                  {/* <TableCell className="text-right">
                <SelectButton
                  projectId={project.projectId}
                  projectName={project.projectName}
                />
              </TableCell>
              <TableCell className="text-right">
                <ActionsButton projectId={project.projectId} />
              </TableCell> */}
                </TableRow>
                <TableRow className="sm:hidden">
                  <TableCell colSpan={6}>
                    <div className="space-y-2 py-2">
                      <div>
                        <span className="font-semibold text-lg">
                          {project.projectName}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Description:</span>{" "}
                        {project.projectDetails}
                      </div>
                      <div>
                        <span className="font-semibold">Date Created:</span>{" "}
                        {project.createDate}
                      </div>
                      <div>
                        <span className="font-semibold">Last Updated:</span>{" "}
                        {project.updateDate}
                      </div>
                      {/* <div className="flex justify-between items-center mt-2">
                    <SelectButton
                      projectId={project.projectId}
                      projectName={project.projectName}
                    />
                    <ActionsButton projectId={project.projectId} />
                  </div> */}
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))
          
        )}
      </TableBody>
    </Table>
  );
}
