"use client";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { createPdfFromMarkdown } from "@/lib/md-parser";
import { Save } from "lucide-react";

export function MarkdownBox({
  markdown,
  fileName,
}: {
  markdown: string;
  fileName: string;
  }) {


  const printIt = async (markdown: string) => {
    createPdfFromMarkdown(markdown, fileName);
  };

  console.log("Markdown:", markdown);

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="flex space-x-4 fixed bottom-0 right-12
       z-20 border border-gray-300 rounded"
      >
        <Button className="" onClick={() => printIt(markdown)} variant="ghost">
          <Save className="h-8 w-8  text-brown hover:text-brown/80" />
        </Button>
      </div>

      <div className="prose-lg">
        <Markdown>{markdown}</Markdown>
      </div>
    </div>
  );
}


