"use client";

import Link from "next/link";
import { Home, Gem,  LucideIcon, Upload } from "lucide-react";

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

interface SidebarItem {
  href: string;
  icon: LucideIcon;
  text: string;
}

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
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
  const menuItems: SidebarCategory[] = [
    {
      category: "Navigation",
      items: [
        { href: "/home", icon: Home, text: "Home" },
      ],
    },
    {
      category: "Account",
      items: [{ href: "/upgrade", icon: Gem, text: "Upgrade" }],
    },

  ];
  return (
    <motion.nav
      className="flex flex-col items-start gap-4 px-2 py-5 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map(({ category, items }) => (
        <motion.div key={category} variants={itemVariants} className="mb-4">
          <p className="text-xs font-medium leading-6 text-zinc-500">
            {category}
          </p>
          <div className="-mx-2 flex flex-1 flex-col">
            {items.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition"
                )}
                onClick={onLinkClick}
              >
                <item.icon className="size-4 text-zinc-500 group-hover:text-zinc-700" />
                {item.text}
              </Link>
            ))}
          </div>
        </motion.div>
      ))}
      <div className="-mx-4 flex items-center">
        <NewProjectDialog />
      </div>
      <div className="-mx-4 flex items-center">
        <ConversationDialog projectId={page} userId={userId} />
      </div>
      <div className="-mx-4 flex items-center">
        <InterviewSummaryDialog projectId={page} userId={userId} />
      </div>
      <div className="-mx-2 flex items-center">
        <Link
          href={`/upload/${page}`}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-full justify-start group flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium leading-6 text-zinc-500 hover:bg-gray-50 transition"
          )}
          onClick={onLinkClick}
        >
          <Upload className="size-4 text-zinc-500 group-hover:text-zinc-700" />
          Upload File
        </Link>
      </div>
      <div className="-mx-4 flex items-center">
        <SettingsDialog userId={userId} />
      </div>
    </motion.nav>
  );
}
