import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { notFound } from "next/navigation";
import type { Project } from "@prisma/client";
import { DocumentTable } from "@/components/tables/document-table";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams: Promise<{
    projectData?: string;
  }>;
};

export default async function ProjectView({ params, searchParams }: PageProps) {
  const auth = await currentUser();
  const { projectId } = await params;
  const { projectData } = await searchParams;

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return redirect("/welcome");
  }

  let project: Project | null = null;

  if (projectData) {
    try {
      project = JSON.parse(projectData) as Project;
    } catch (error) {
      console.error("Error parsing project data:", error);
    }
  }

  if (!project) {
    // Fallback to fetching from the database if projectData is not available
    project = await db.project.findUnique({
      where: { id: projectId },
    });
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col">
      <PageFrame page={`Project: ${project.projectName}`} userId={user.id} navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="project-view" userId={user.id} projectId={projectId} />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title={`Project: ${project.projectName}`} />
            <MainContentRow>
              <DocumentTable project={project} />
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
