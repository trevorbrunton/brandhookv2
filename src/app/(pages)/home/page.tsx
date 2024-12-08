import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import {CreateCollectionForm} from "@/components/create-collection-form";
import { AddUserToCollectionForm } from "@/components/add-user-to-collection-form";


export default async function Home() {
  const auth = await currentUser();

  const navItems = null;

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

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="home" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="home" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Home" />
            <MainContentRow>
              <CreateCollectionForm userId={user.id} userEmail={user.email} collectionId="new" />
              <AddUserToCollectionForm userId={user.id}  collectionId="new" />
            </MainContentRow>
            
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
