"use client";
import {  Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentChooserBarProps {
  activeDocClass: string;
  processing: boolean;
  chooseDocClass: (docClass: string) => void;
}

export function DocumentChooserBar({
  activeDocClass,
  processing,
  chooseDocClass,
}: DocumentChooserBarProps) {
  return (
    <div className="flex flex-col items-center justify-between bg-background mb-2 w-full border-b-2 p-2">
      <div className="flex space-x-4 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          onClick={() => chooseDocClass("interview")}
          className={
            activeDocClass === "interview" ? "underline underline-offset-4" : ""
          }
        >
          Upload Interview Transcript
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            chooseDocClass("wow-moments");
          }}
          className={
            activeDocClass === "wow-moments"
              ? "underline underline-offset-4"
              : ""
          }
        >
          Upload Wow Moments
        </Button>
      </div>
      <div>
        {processing && (
          <div className="flex space-x-2 text-xs items-center">
            <span>Processing document...</span>
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
}
