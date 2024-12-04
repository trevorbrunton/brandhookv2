"use client";
import Image from "next/image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Inbox, File, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Memory } from "@/lib/collection-types";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { nanoid } from "@/lib/utils";

import { getSignedURL } from "@/app/actions/upload-helper";
import { useRouter } from "next/navigation";

import { saveDocToDb } from "@/app/actions/save-doc-to-db";

export function UploadFileForm({
  currentProjectId,
}: {
  currentProjectId: string;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");

  const [documentDate, setDocumentDate] = useState<Date>(new Date());
  const { toast } = useToast();
  const router = useRouter();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const buttonDisabled = loading;

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  const handleFileUpload = async (file: File) => {
    const signedURLResult = await getSignedURL({
      fileSize: file.size,
      fileType: file.type,
      checksum: await computeSHA256(file),
      fileName: file.name,
      documentTitle,
      documentDate: documentDate.toLocaleString("en-Au"),
    });

    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure);
    }
    const { url, id, uploadedFileName } = signedURLResult.success;
    const result = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return { uploadUrl: result.url, id, uploadedFileName };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    toast({
      title: "Uploading Document",
      description: "Your document is on its way to the cloud",
    });
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
      });
      setLoading(false);
      return;
    }
    try {
      if (file) {
        const result = await handleFileUpload(file);
        console.log("File uploaded successfully");

        const newDocument: Memory = {
          documentId: nanoid(),
          title: documentTitle,
          fileUrl: `${process.env.NEXT_PUBLIC_S3_URL}${result.uploadedFileName}`,
          docType: "goober",
          collectionId: "recent",
          createDate: new Date().toLocaleDateString("eu-AU"),
          updateDate: new Date().toLocaleDateString("eu-AU"),
        };
        try {
          await saveDocToDb(newDocument, currentProjectId);
        } catch (error) {
          console.error(error);
          toast({
            title: "Database Error",
            description:
              "Your document was uploaded but not saved to your project.",
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "File Upload Error",
        description: "Something bad happened and your file didn't upload.",
      });
    } finally {
      toast({
        title: "Upload Successful",
        description: "Your document has beed saved",
      });
      router.push("/home");
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (acceptedFiles[0]) {
        const url = URL.createObjectURL(acceptedFiles[0]);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      toast({
        title: "This file type is not supported.",
        description: "Please choose a MSWord file instead.",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      // "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <>
      <Card className="w-full border-none">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Upload Document</h2>
        </CardHeader>
        <CardContent>
          <form className="px-6 py-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 items-start pb-4 w-full">
              <div className="flex flex-col w-full space-y-4">
                <div className="flex flex-col space-y-2">
                  <span className="text-slate-900 text-sm">Document Title</span>
                  <Input
                    required
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col justify start items-start gap-x-2">
                  <span className="text-slate-900 text-sm">Document Date</span>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !documentDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {documentDate ? (
                          format(documentDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={documentDate}
                        onSelect={(day: Date | undefined) =>
                          setDocumentDate(day || new Date())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 w-full">
                {previewUrl && file && (
                  <div className="mt-4">
                    {file.type.startsWith("image/") ? (
                      <Image
                        src={previewUrl}
                        alt="Selected file"
                        width="200"
                        height="200"
                      />
                    ) : null}
                    {file && (
                      <div className="flex justify-center items-center max-w-64 text-xs text-wrap ">
                        <File className="w-4 h-4 m-2 shrink-0 text-sky-800" />
                        {file.name}
                      </div>
                    )}
                  </div>
                )}

                {!file && (
                  <div
                    {...getRootProps({
                      className:
                        "border-dashed border-2 rounded-xl cursor-pointer bg-slate-200 py-12 flex justify-center items-center flex-col w-full",
                    })}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <div className="h-16 flex flex-col items-center">
                        <Inbox className="w-8 h-8" />
                        <p className="text-xs text-center pt-4">
                          Drop the files here ...
                        </p>
                      </div>
                    ) : (
                      <div className="h-16 flex flex-col items-center">
                        <Inbox className="w-8 h-8 text-slate-900" />
                        <span className=" text-xs text-wrap text-center pt-4">
                          Drag and drop a file here, <br /> or click to select
                          files
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-8 mt-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFile(null)}
                className={file ? "block" : "invisible"}
              >
                remove
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => router.push(`/project-view/${currentProjectId}`)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={buttonDisabled}>
                upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
