import Markdown from "react-markdown";
// import { CompletionSidebar } from "./completion-sidebar";

interface AnswerBoxProps {
  completion: string;
  businessIssue: string;
  hypotheses: string[];
}
export function AnswerBox({
  completion,
  // businessIssue,
  // hypotheses,
}: AnswerBoxProps) {
  return (
    <div className="flex w-full h-full m-2">
      {/* <CompletionSidebar
        businessIssue={businessIssue}
        hypotheses={hypotheses}
      /> */}
      <div className="w-full border-2 rounded p-2 text-sm leading-loose overflow-auto">
        <div className="prose-lg">
          <Markdown>{completion}</Markdown>
        </div>
      </div>
    </div>
  );
}
