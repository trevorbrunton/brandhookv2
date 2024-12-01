"use client";
import { UploadFileForm } from "./upload-file-form";
import { MainContentRow } from "@/components/main-content-row";
import { PageHeader } from "@/components/page-header";

import { Navbar } from "@/components/navbars/navbar";

export default function UploadPage({ params }: { params: { projectId: string } }) {
  const currentProjectId = params.projectId;
  const navItems = [
    {
      label: "Go Back",
      href: `/project-view/${currentProjectId}`,
      tooltip: "Back to Project View",
    },
  ];
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar navItems={navItems} />
      <div className="flex flex-row flex-auto">
        <div className="flex flex-row flex-auto">
          <div className="flex flex-col flex-auto">
            <PageHeader title="Upload a Document" />
            <MainContentRow>
              <div className="flex flex-col items-center w-full">
                <UploadFileForm currentProjectId={currentProjectId} />
              </div>
            </MainContentRow>
          </div>
        </div>
      </div>
    </div>
  );
}
