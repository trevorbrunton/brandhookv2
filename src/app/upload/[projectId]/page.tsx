import { UploadFileForm } from "./upload-file-form";
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";
import { PageFrame } from "@/components/pageframe";

import { NavSideBar } from "@/components/navbars/nav-side-bar";

export default async function UploadPage({ params }: { params: Promise<{ projectId: string }> }) {
  const currentProjectId = (await params).projectId;
  const navItems = [
    {
      label: "Home",
      href: `/home`,
      tooltip: "Back to Project View",
    },
  ];

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
                <UploadFileForm currentProjectId={currentProjectId} />
              </div>
            </MainContentRow>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}


