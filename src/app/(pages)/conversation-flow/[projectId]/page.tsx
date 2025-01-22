import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import type { Project } from "@prisma/client";
import { ConversationDialog } from "@/components/dialogs/add-conversation-dialog";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;

};

export default async function ProjectView({ params}: PageProps) {
  const auth = await currentUser();
  const { projectId } = await params;


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

  //fetch project data
  const projectData = await db.project.findUnique({
    where: { id: projectId },
  });




  return (
    <div className="flex w-full flex-col">
      <PageFrame page="New Conversation" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page={projectId} />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="New Conversation" />
            <MainContentRow>
              {projectData && <ConversationDialog project={projectData} />}
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
