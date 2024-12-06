import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { db } from "@/db";
import { PageFrame } from "@/components/pageframe";

type PageProps = {
  params: Promise<{
    collectionId: string;
  }>;
};

export default async function Collection({ params }: PageProps) {
  const auth = await currentUser();
  const { collectionId } = await params;


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
  const collection = await db.collection.findFirst({
    where: { collectionId: collectionId, userId: user.id },
    include: { memories: true },
  });
  if (!collection) {
    return <p> Project fetch failed </p>;
  }

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <PageFrame page="collection" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="collection" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title={`Collection: ${collection.collectionName}`} />
            <MainContentRow>
              <div className="flex flex-col justify-center w-full pt-24 min-h-full">
                <div>
                  {collection
                    ? collection.collectionName
                    : "No collection found"}
                </div>
                <div>
                  {collection &&
                    collection.memories.map((memory) => {
                      return (
                        <div key={memory.documentId}>
                          <li>
                            <div>
                              {memory.fileUrl}
                              {memory.collectionId}
                            </div>
                          </li>
                        </div>
                      );
                    })}
                </div>
                
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
