import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";
import { CreateCollectionForm } from "@/components/create-collection-form";
import { AddUserToCollectionForm } from "@/components/add-user-to-collection-form";
import { MemoryList } from "@/components/memory-list";
import { Heading } from "@/components/heading";
import { Kanban } from "@/components/dnd-collections";

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
  const collection = await db.collection.findFirst({
    where: { id: user.defaultCollectionId, userId: user.id },
  });
  if (!collection) {
    return <p> Collection fetch failed </p>;
  }

  //fetch the memories in the collection.memory array from the memory table
  const memories = await db.memory.findMany({
    where: { id: { in: collection.memories } },
  });

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
              <CreateCollectionForm userId={user.id} userEmail={user.email} />
              <AddUserToCollectionForm userId={user.id} collectionId="new" />
              <Heading className="mx-auto sm:text-lg"> Recent Uploads </Heading>
              <MemoryList
                memories={memories}
                collectionId={collection.id}
              /><Kanban />
            </MainContentRow>
          </div>
        </div>
        
      </PageFrame>
    </div>
  );
}
