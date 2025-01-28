// DEV Note - Review what format of docs should be allowed to be uploaded
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

import { getSignedURL } from "@/app/actions/upload-helper";
import { useRouter } from "next/navigation";

import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import { DocumentChooserBar } from "@/app/(pages)/upload/[projectId]/document-chooser-bar";

interface UploadDialogProps {
  projectId: string;
  userId: string;
}

export function UploadFileForm({ projectId, userId }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDate, setDocumentDate] = useState<Date>(new Date());
  const [interviewee, setInterviewee] = useState("");
  const [activeDocClass, setActiveDocClass] = useState("interview");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const computeSHA256 = async (file: File) => {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      await file.slice(0, 1_048_576).arrayBuffer() // Process the first MB for a quick checksum.
    );
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleFileUpload = async (file: File) => {
    try {
      const signedURLResult = await getSignedURL({
        fileSize: file.size,
        fileType: file.type,
        checksum: await computeSHA256(file),
        fileName: file.name,
        documentTitle,
        documentDate: documentDate.toISOString(),
      });

      if (signedURLResult.failure) {
        throw new Error(signedURLResult.failure);
      }

      if (!signedURLResult.success) {
        throw new Error("Failed to get signed URL");
      }
      const { url, uploadedFileName } = signedURLResult.success;
      const uploadResult = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResult.ok) {
        throw new Error("Failed to upload file to the server");
      }

      return uploadedFileName;
    } catch (error) {
      console.error("File upload error:", error);
      throw error; // Propagate the error for higher-level handling.
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setProcessing(true);

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
      const result = await handleFileUpload(file);
      console.log("File uploaded successfully");

      const parsedResponse = await fetch("/api/parse-data", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          formData.append("theFile", file);
          formData.append("fileName", result);
          formData.append("url", `${process.env.NEXT_PUBLIC_S3_URL}${result}`);
          return formData;
        })(),
      });
      const response = await parsedResponse.json();

      if (!parsedResponse.ok) {
        throw new Error(response.error);
      }
      const docClass = file.type.startsWith("audio") ? "transcript" : activeDocClass;
      const newDocument = {
        id: "",
        projectId,
        userId,
        title: documentTitle,
        interviewee: interviewee,
        interviewDate: documentDate.toISOString(),
        content: response.parsedText,
        fileUrl: `${process.env.NEXT_PUBLIC_S3_URL}${result}`,
        docType: docClass,
        createDate: new Date().toLocaleDateString("eu-AU"),
        updateDate: new Date().toLocaleDateString("eu-AU"),
      };
      await saveDocToDb(newDocument, projectId);
      toast({
        title: "Summarising Document",
        description: "Your document is being summarised",
      });

      if (activeDocClass === "wow-moments") {
        toast({
          title: "Upload Successful",
          description: "Your document has been saved",
        });
        setLoading(false);
        setProcessing(false);
        router.push(`/project-view/${projectId}`);
        return;
      }

      const summaryResponse = await fetch("/api/sumarise-intervew", {
        method: "POST",
        body: JSON.stringify({ parsedText: response.parsedText }),
        headers: { "Content-Type": "application/json" },
      });

      const summaryText = await summaryResponse.json();

      console.log("Summary response", summaryText);

      const summaryDocument = {
        id: "",
        projectId,
        userId,
        title: `${documentTitle} - Summary`,
        interviewee: interviewee,
        interviewDate: documentDate.toISOString(),
        content: summaryText.interviewSummary,
        fileUrl: `${process.env.NEXT_PUBLIC_S3_URL}${result}`,
        docType: `${activeDocClass}-summary`,
        createDate: new Date().toLocaleDateString("eu-AU"),
        updateDate: new Date().toLocaleDateString("eu-AU"),
      };
      await saveDocToDb(summaryDocument, projectId);

      toast({
        title: "Upload Successful",
        description: "Your document has been saved and summarised",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "File Upload Error",
        description: "Something bad happened and your file didn't upload.",
      });
    } finally {
      setLoading(false);
      setProcessing(false);
      router.push(`/project-view/${projectId}`);
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
        description: "Please choose a PDF, MSWordor Audio file instead.",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      //include audio files
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/mp4a-latm": [".m4a"],
    },
    maxFiles: 1,
    onDrop,
  });

  const chooseDocClass = (docClass: string) => {
    setActiveDocClass(docClass);
  };

  return (
    <>
      <Card className="w-full border-none">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Upload File</h2>
        </CardHeader>
        <CardContent>
          <DocumentChooserBar
            activeDocClass={activeDocClass}
            processing={processing}
            chooseDocClass={chooseDocClass}
          />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="documentTitle" className="text-sm font-medium">
                Document Title
              </label>
              <Input
                id="documentTitle"
                required
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="interviewee"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interviewee
                </label>
                <Input
                  id="interviewee"
                  required
                  value={interviewee}
                  onChange={(e) => setInterviewee(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="interviewDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interview Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="interviewDate"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                  <PopoverContent className="w-auto p-0 z-[70]" align="start">
                    <Calendar
                      mode="single"
                      selected={documentDate}
                      onSelect={(date) => date && setDocumentDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div
              {...getRootProps({
                className: cn(
                  "border-dashed border-2 rounded-xl cursor-pointer bg-slate-100 py-8 flex justify-center items-center flex-col",
                  isDragActive && "border-primary"
                ),
              })}
            >
              <input {...getInputProps()} />
              {previewUrl && file ? (
                <div className="flex flex-col items-center space-y-2">
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={previewUrl || "/placeholder.svg"}
                      alt="Selected file"
                      width={200}
                      height={200}
                    />
                  ) : (
                    <File className="w-16 h-16 text-primary" />
                  )}
                  <span className="text-sm text-center break-all max-w-[200px]">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <Inbox className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop a file here, or click to select a file
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/project-view/${projectId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !file}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
