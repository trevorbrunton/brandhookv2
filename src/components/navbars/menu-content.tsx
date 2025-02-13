"use client";

import Link from "next/link";
import { Home,  Upload, ArrowBigLeft } from "lucide-react";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ConversationDialog } from "@/components/dialogs/add-conversation-dialog";
import { InterviewSummaryDialog } from "@/components/dialogs/interview-summary-dialog";
import { useRouter } from "next/navigation";
import { HomeMenu } from "@/components/navbars/sub-menus/home-menu";

interface MenuContentProps {
  onLinkClick: () => void;
  page: string;
  userId: string;
  projectId: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function MenuContent({ onLinkClick, page, userId, projectId }: MenuContentProps) {
  const router = useRouter();

  console.log("page", page);

  return (
    <motion.nav
      className="flex flex-col items-start gap-4 px-2 py-5 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4">
        {page == "project-view" && (
          <>
            <p className="text-xs font-medium leading-6 text-zinc-500">
              Navigation
            </p>
            <Link
              href={"/home"}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
              )}
              onClick={onLinkClick}
            >
              <Home className="size-4 text-zinc-500 group-hover:text-zinc-700" />
              Home
            </Link>
            <p className="text-xs font-medium leading-6 text-zinc-500 mt-8 ">
              Actions
            </p>

            <Link
              href={`/upload/${projectId}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
              )}
              onClick={onLinkClick}
            >
              <Upload className="size-4 text-zinc-500 group-hover:text-zinc-700" />
              Upload a File
            </Link>

            <div className="py-1.5 flex items-center">
              <ConversationDialog projectId={projectId} userId={userId} />
            </div>
            <div className="py-1.5 flex items-center">
              <InterviewSummaryDialog projectId={projectId} userId={userId} />
            </div>

            <Link
              href={`/summarise-wows?projectId=${projectId}&userId=${userId}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
              )}
            >
              <Upload className="size-4 text-zinc-500 group-hover:text-zinc-700" />
              Summarise Wow Moments
            </Link>
          </>
        )}
        {page == "home" && (
          <HomeMenu userId={userId} onLinkClick={onLinkClick} />
        )}
        {page.startsWith("document-viewer") && (
          <>
            <p className="text-xs font-medium leading-6 text-zinc-500">
              Navigation
            </p>
            <div className="flex  flex-col">
              <div className="mx-1 flex items-center">
                <Link
                  href={`/upload/${projectId}`}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
                  )}
                  onClick={() => router.back()}
                >
                  <ArrowBigLeft className="size-4 text-zinc-500 group-hover:text-zinc-700" />
                  Go Back
                </Link>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
}
