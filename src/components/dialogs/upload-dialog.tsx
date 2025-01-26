"use client";

import { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { Inbox, File, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSignedURL } from "@/app/actions/upload-helper";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import { Upload } from "lucide-react";

import { DocumentChooserBar } from "@/components/dialogs/document-chooser-bar";

interface UploadDialogProps {
  projectId: string;
  userId: string;
}

export function UploadDialog({ projectId, userId }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDate, setDocumentDate] = useState<Date>(new Date());
  const [interviewee, setInterviewee] = useState("");
  const [activeDocClass, setActiveDocClass] = useState("interview");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const computeSHA256 = async (file: File) => {
    const hash = await crypto.subtle.digest(
      "SHA-256",
      await file.slice(0, 1_048_576).arrayBuffer()
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
      throw error;
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




      const newDocument = {
        id: "",
        projectId,
        userId,
        title: documentTitle,
        interviewee: "",
        interviewDate: documentDate.toISOString(),
        content: "",
        fileUrl: `${process.env.NEXT_PUBLIC_S3_URL}${result}`,
        docType: activeDocClass,
        createDate: new Date().toLocaleDateString("eu-AU"),
        updateDate: new Date().toLocaleDateString("eu-AU"),
      };

      await saveDocToDb(newDocument, projectId);

      toast({
        title: "Upload Successful",
        description: "Your document has been saved",
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "File Upload Error",
        description: "Something bad happened and your file didn't upload.",
      });
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPreviewUrl(url);
    } else {
      toast({
        title: "This file type is not supported.",
        description: "Please choose a supported file type.",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/webp": [".webp"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxFiles: 1,
    onDrop,
  });

  const chooseDocClass = (docClass: string) => {
    setActiveDocClass(docClass);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center text-zinc-500 group-hover:text-zinc-700 -my-2"
        >
          <Upload size={16} />
          Upload a document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] z-50">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
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
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
