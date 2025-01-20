"use client";

import { MainContentRow } from "./main-content-row";
import { Button } from "./ui/button";
import { Save } from "lucide-react";
import Link from "next/link";
type Props = { url: string };

/**
 * PDFViewer Component
 *
 * This component is responsible for rendering a PDF ProjectDocument within an iframe.
 * It takes a URL as a prop and displays the PDF from that URL.
 *
 * @param {Props} props - The props object containing the URL of the PDF.
 * @param {string} props.url - The URL of the PDF to be displayed.
 *
 * @returns {JSX.Element} The rendered PDFViewer component.
 */
export function PDFViewer({ url }: Props) {
  const fileType = url.split(".").pop();
  console.log(fileType);
  return (
    <MainContentRow>
      <div className="flex flex-col space-y-2 relative">
        {fileType === "pdf" && (
          <iframe src={url} className="w-screen h-screen px-6"></iframe>
        )}
        {fileType === "docx" && (
          <iframe
            src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}
            className="w-screen h-screen px-6"
          ></iframe>
        )}
      </div>
      
      <div className="flex space-x-4 fixed bottom-0 right-12
       z-20 border border-gray-300 rounded">

        <Button className="" variant="ghost">
          <Link href={url}>
            <Save className="h-6 w-6  text-brown hover:text-brown/80" />
          </Link>
        </Button>
      </div>
    </MainContentRow>
  );
}
