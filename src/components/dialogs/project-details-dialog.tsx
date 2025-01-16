"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { updateProjectDetails } from "./project-details-actions";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ProjectDetailsFormSchema } from "@/lib/project-form-schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProjectDetailsDialogProps {
  projectId: string;
  userEmail: string;
  projectName: string;
  projectDetails: string;
}

export function ProjectDetailsDialog({
  projectId,
  projectName,
  projectDetails,
  userEmail,
}: ProjectDetailsDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof ProjectDetailsFormSchema>>({
    resolver: zodResolver(ProjectDetailsFormSchema),
    defaultValues: {
      projectName: projectName || "",
      projectDetails: projectDetails || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof ProjectDetailsFormSchema>) => {
    const completedProjectData = { ...data, projectId, userEmail };
    setSubmitted(true);
    console.log("completedProjectData", completedProjectData);
    // const result = await updateProjectDetails(completedProjectData);
    setSubmitted(false);
    setOpen(false);
    router.push("/home");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create a new Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter Project Details</DialogTitle>
          <DialogDescription>
            Enter details of your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Project Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for the project"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitted}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

