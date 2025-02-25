"use client";
import {  Brain } from "lucide-react";
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
          Upload Interview Transcript (document or audio)
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
          Upload Wow Moments (document or audio)
        </Button>
      </div>
      <div>
        {processing && (
          <div className="flex space-x-2 text-xs items-center py-2 text-orange-600">
            <span>Processing document...</span>
            <Brain className="size-4 animate-bounce" />
          </div>
        )}
      </div>
    </div>
  );
}
