import { fetchDocument } from "@/app/actions/fetch-document"
import { notFound } from "next/navigation"
import { NavSideBar } from "@/components/navbars/nav-side-bar"
import { PageFrame } from "@/components/pageframe"
import { PageHeader } from "@/components/page-header"
import { MainContentColumn } from "@/components/main-content-column"
import { DocumentContent } from "@/components/document-content"

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

export default async function DocumentViewer({ params }: PageProps) {
  const { documentId } = await params

  const document = await fetchDocument(documentId)

  if (!document) {
    notFound()
  }

  return (
    <PageFrame page="document-viewer" userId="" navItems={null} projectId="">
      <div className="flex flex-row flex-auto">
        <div className="hidden sm:block border-r border-gray-100 h-full text-brand-900 relative z-10">
          <NavSideBar page="document-viewer" userId=""projectId={document.projectId} />
        </div>
        <div className="flex flex-col flex-auto">
          <PageHeader title={`Document: ${document.title}`} />
          <MainContentColumn>
            <DocumentContent document={document} />
          </MainContentColumn>
        </div>
      </div>
    </PageFrame>
  )
}

