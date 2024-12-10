import { UploadFileForm } from "./upload-file-form";
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { PageFrame } from "@/components/pageframe";
import { currentUser } from "@clerk/nextjs/server";
import {db} from "@/db";

import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { redirect } from "next/navigation";

export default async function UploadPage({ params }: { params: Promise<{ collectionId: string }> }) {
  const {collectionId} = (await params);
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
      <PageFrame page="upload" navItems={navItems}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="upload" />
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title="Upload File" />
            <MainContentRow>
              <div className="flex justify-center w-full  pt-8 min-h-full">
                <UploadFileForm collectionId={collectionId} userId={user.id} defaultCollectionId={user.defaultCollectionId}/>
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}


