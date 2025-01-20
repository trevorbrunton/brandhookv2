import Link from "next/link";
import {DocActionsButton} from "@/components/tables/doc-actions-button";
import type { ProjectDocument, Project } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


export async function DocumentTable({ project }: { project: Project }) {
  const documents =
    project.projectDocuments as unknown as ProjectDocument[];
  if (documents.length === 0) {
    return (
      <div className="flex justify-center mt-12">
        No Documents available
      </div>
    );
  }
  return (
    <Table>
      <TableHeader className="bg-gray-400">
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date Created</TableHead>
          {/* Added header for updateDate */}
          <TableHead className="text-right"></TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((document) => (
          <TableRow key={document.id}>
            <TableCell className="font-medium">{document.title}</TableCell>
            <TableCell>{document.createDate}</TableCell>
            <TableCell>
              <Button>
                <Link
                  href={`/document-viewer/${encodeURIComponent(
                    document.id
                  )}/${encodeURIComponent(project.id)}`}
                >
                  View
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <DocActionsButton 
                projectId={project.id}
                documentId={document.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
