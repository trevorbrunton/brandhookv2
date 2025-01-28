"use client";

import Link from "next/link";
import { Home, Gem, Upload } from "lucide-react";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NewProjectDialog } from "@/components/dialogs/new-project-details-dialog";
import { ConversationDialog } from "@/components/dialogs/add-conversation-dialog";
import { SettingsDialog } from "@/components/dialogs/settings-dialog";
import { InterviewSummaryDialog } from "@/components/dialogs/interview-summary-dialog";

interface MenuContentProps {
  onLinkClick: () => void;
  page: string;
  userId: string;
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

export function MenuContent({ onLinkClick, page, userId }: MenuContentProps) {

  return (
    <motion.nav
      className="flex flex-col items-start gap-4 px-2 py-5 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="mb-4">
        {page !== "home" ? (
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
              href={`/upload/${page}`}
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
              <ConversationDialog projectId={page} userId={userId} />
            </div>
            <div className="py-1.5 flex items-center">
              <InterviewSummaryDialog projectId={page} userId={userId} />
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-medium leading-6 text-zinc-500">
              Actions
            </p>
            <div className="mx-1 flex items-center">
              <NewProjectDialog />
            </div>
          </>
        )}

        <p className="text-xs font-medium leading-6 text-zinc-500 mt-8">
          Settings
        </p>
        <div className="flex flex-1 flex-col">
          <div className="py-1.5 flex items-center">
            <SettingsDialog userId={userId} />
          </div>
          <Link
            href={"/upgrade"}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition mx-2"
            )}
            onClick={onLinkClick}
          >
            <Gem className="size-4 text-zinc-500 group-hover:text-zinc-700" />
            Upgrade
          </Link>
        </div>
        <div className="-mx-2 flex flex-1 flex-col"></div>
      </motion.div>
    </motion.nav>
  );
}
