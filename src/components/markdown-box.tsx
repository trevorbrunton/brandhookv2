"use client";
import { useRef } from "react";
import Markdown from "react-markdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
  const page1 = useRef<HTMLDivElement>(null);
  const page2 = useRef<HTMLDivElement>(null);
  const page3 = useRef<HTMLDivElement>(null);
  const page4 = useRef<HTMLDivElement>(null);

  // Split markdown into chunks of 40 lines
  const lines = markdown.split("\n");
  const first40 = lines.slice(0, 39).join("\n");
  const second40 = lines.slice(40, 79).join("\n");
  const third40 = lines.slice(80, 119).join("\n");
    const fourth40 = lines.slice(120, 139).join("\n");

  const printIt = async (markdown: string) => {
    // await screenshot(page1.current!, "1", fileName);
    // if (second40) await screenshot(page2.current!, "2", fileName);
    // if (third40) await screenshot(page3.current!, "3", fileName);
    // if (fourth40) await screenshot(page4.current!, "4", fileName);
    createPdfFromMarkdown(markdown, fileName);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div
        className="flex space-x-4 fixed bottom-0 right-12
       z-20 border border-gray-300 rounded"
      >
        <Button
          className=""
          onClick={() => printIt(markdown)}
          variant="ghost"
        >
          <Save className="h-8 w-8  text-brown hover:text-brown/80" />
        </Button>
      </div>


      <div ref={page1}>
        <div className="prose-lg">
          <Markdown>{first40}</Markdown>
        </div>
      </div>
      {second40 && (
        <div ref={page2}>
          <div className="prose-lg">
            <Markdown>{second40}</Markdown>
          </div>
        </div>
      )}
      {third40 && (
        <div ref={page3}>
          <div className="prose-lg">
            <Markdown>{third40}</Markdown>
          </div>
        </div>
      )}
      {fourth40 && (
        <div ref={page4}>
          <div className="prose-lg">
            <Markdown>{fourth40}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

// Download a Screenshot
export async function screenshot(page: HTMLDivElement, pageNum: string, fileName: string) {
  const canvas = await html2canvas!(page);
  const pdf = new jsPDF({
    orientation: "portrait",
  });
  const imgProps = pdf.getImageProperties(canvas);
  const width = pdf.internal.pageSize.getWidth();
  const height = (imgProps.height * width) / imgProps.width;
  pdf.addImage(canvas, "JPEG", 10, 10, width * 0.9, height);
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.save(`${fileName}-${pageNum}.pdf`);
  return "done";
}
