import type { ProjectDocument } from "@prisma/client"
import { MarkdownBox } from "@/components/markdown-box"
import { PDFViewer } from "@/components/pdf-viewer"

interface DocumentContentProps {
  document: ProjectDocument
}

export function DocumentContent({ document }: DocumentContentProps) {
  const isMarkdownType = [
    "interview-summary",
    "conversation",
    "project-summary",
    "wow-moments-summary",
    "wow-moment-transcript",
    "transcript"
  ].includes(document.docType)

  const isPDFType = ["interview", "wow-moments"].includes(document.docType)

  return (
    <div className="text-sm font-light mx-12">
      {isMarkdownType && document.content && (
        <MarkdownBox markdown={document.content.toString()} fileName={document.title} />
      )}
      {isPDFType && document.fileUrl && <PDFViewer url={document.fileUrl} />}
    </div>
  )
}

