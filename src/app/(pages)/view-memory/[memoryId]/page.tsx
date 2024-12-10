import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { AddPerson } from "@/components/dialogs/add-person-to-memory";



type PageProps = {
  params: Promise<{
    memoryId: string;
  }>;
};

export default async function ViewMemory({ params }: PageProps) {
  const auth = await currentUser();
  const { memoryId } = await params;

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

  if (!auth) {
    redirect("/sign-in");
  }
  //check if user has user profile
  const user = await db.user.findUnique({
    where: { externalId: auth.id },
  });

  if (!user) {
    return redirect("/welcome");
  }
    const memory = await db.memory.findFirst({
      where: { id: memoryId },
    });
    if (!memory) {
      return <p> Collection fetch failed </p>;
    }



  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="memory" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="memory" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title={`Memory Details: ${memory.title}`} />
            <MainContentRow>
              <div className="flex items-start justify-start w-full min-h-full p-6 space-x-6">
                {memory && (
                  <div>
                    <img
                      src={memory.fileUrl ? memory.fileUrl : ""}
                      alt={memory.title}
                      className="w-72"
                    />
                  </div>
                )}
              <AddPerson memoryId={memoryId} />
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
