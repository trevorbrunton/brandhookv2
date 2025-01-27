import { fetchDocument } from "@/app/actions/fetch-document";
import type { ProjectDocument } from "@prisma/client";
import { NavSideBar } from "@/components/navbars/nav-side-bar";
import { PageFrame } from "@/components/pageframe";
import { PageHeader } from "@/components/page-header";
import { MainContentColumn } from "@/components/main-content-column";
import { PDFViewer } from "@/components/pdf-viewer";
import { MarkdownBox } from "@/components/markdown-box";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";

interface PageProps {
  params: Promise<{ documentId: string }>;
}

export default async function DocumentViewer({ params }: PageProps) {
  const { documentId } = await params;
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
  console.log("documentId", documentId);
  const result = await fetchDocument(documentId);
  if (result.error) {
    return <p>Document fetch failed</p>;
  }
  const document = (await result.success) as ProjectDocument;

  console.log("document", document);

  return (
    <div className="flex w-full flex-col ">
      <PageFrame page="Document Viewer" navItems={navItems} userId={user.id}>
        <div className="flex flex-row flex-auto">
          <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
            <NavSideBar page="document-viewer" userId={user.id} />{" "}
            {/*/DEV note - need to pass in userId */}
          </div>
          <div className="flex flex-col flex-auto">
            <PageHeader title={`Document: ${document.title}`} />
            <MainContentColumn>
              <div className="text-sm font-light mx-12">
                {(document.docType === "interview-summary" ||
                  document.docType === "conversation" ||
                  document.docType === "project-summary" ||
                  document.docType === "wow-moments-summary") && (
                  <MarkdownBox
                    markdown={document.content!.toString()}
                    fileName={document.title}
                  />
                )}
                {(document.docType === "interview" ||
                  document.docType === "wow-moments") && (
                  <PDFViewer url={document.fileUrl as string} />
                )}
              </div>
            </MainContentColumn>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}
