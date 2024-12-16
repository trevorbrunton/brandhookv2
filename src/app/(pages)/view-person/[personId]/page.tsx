import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { PeopleDialog } from "@/components/dialogs/create-person-record";
import { PersonDetailsForm } from "./person-details-form";

import { GoBackButton } from "@/components/go-back-button";

type PageProps = {
  params: Promise<{
    personId: string;
  }>;
};

export default async function ViewMemory({ params }: PageProps) {
  const auth = await currentUser();
  const { personId } = await params;

  if (personId === "new") {
    return <PeopleDialog />;
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

  //  DEVNOTE ----- NEED TO FETCH MEMORIES, EVENTS, PLACES    NO RETHINK THIS - THESE SHOULDN'T BE APGRADED HERE!!!!

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="memory" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="memory" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader
              title={`Person Details: ${person?.name ?? "New Person"}`}
            />
            <MainContentRow>
              <div className="flex flex-col md:flex-row items-start justify-start w-full min-h-full p-4 md:p-6 space-y-6 md:space-y-0 md:space-x-6">
                <div className="flex flex-col items-center space-y-6 md:w-1/3">
                  {person && (
                    <div className="w-full flex justify-center">
                      <img
                        src={person.picUrl || "/shadow.jpg"}
                        alt={person.name}
                        className="w-48 md:w-72 rounded-lg shadow-md"
                      />
                    </div>
                  )}
                  <GoBackButton />
                </div>
                <div className="flex flex-col items-center md:items-start justify-start w-full md:w-2/3 space-y-6">
                  <PersonDetailsForm
                    initialData={{
                      ...person,
                      dateOfBirth: person?.dateOfBirth ?? undefined,
                      picUrl: person?.picUrl ?? undefined,
                    }}

                  />
                </div>
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
