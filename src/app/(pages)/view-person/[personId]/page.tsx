import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
// import { AddPerson } from "@/components/dialogs/add-person-to-memory";

// import { GoBackButton } from "@/components/go-back-button";




type PageProps = {
  params: Promise<{
    personId: string;
  }>;
};

export default async function ViewMemory({ params }: PageProps) {
  const auth = await currentUser();
  const { personId } = await params;

  if (personId === "new") {
      return <p> Create a new person! </p>;
    }

  const navItems = null;

  if (!auth) {
    redirect("/sign-in");
  }

  if (!auth) {
    redirect("/sign-in");
  }
  //check if user has user profile
  const user = await db.user.findUnique({
    where: { externalId: auth?.id ?? "" },
  });

  if (!user) {
    return redirect("/welcome");
  }
    const person = await db.person.findFirst({
      where: { id: personId },
    });
    if (!person) {
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
            <PageHeader title={`Person Details: ${person?.name ??"New Person"}`} />
            <MainContentRow>
              {/*}  <div className="flex items-start justify-start w-full min-h-full p-6 space-x-6">
                <div className=" flex flex-col items-center space-y-6">
                  {memory && (
                    <div>
                      <img
                        src={memory.fileUrl ? memory.fileUrl : ""}
                        alt={memory.title}
                        className="w-72"
                      />
                    </div>
                  )}
                
                    <GoBackButton />
                </div>
                <div className="flex items-center justify-start w-full min-h-full space-x-6">
                  <AddPerson memoryId={memoryId} />
                  <span>people details go here</span>
                </div>
              </div>*/}
        hello {personId}
        hello {user?.id ?? "no user"}
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
