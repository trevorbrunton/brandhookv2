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
import {FolderPlus} from "lucide-react";
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
import { createProject } from "@/app/actions/create-new-project";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export function NewProjectDialog() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ProjectDetailsFormSchema>>({
    resolver: zodResolver(ProjectDetailsFormSchema),
    defaultValues: {
      projectName: "",
      projectDetails: "",
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      projectName,
      projectDetails,
    }: {
      projectName: string;
      projectDetails: string;
    }) => createProject(projectName, projectDetails),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all_projects"] });
      setOpen(false);
      setSubmitted(false);
      router.push("/home");
    },
    onError: (error: unknown) => {
      console.error("Failed to create project:", error);
    },
  });

  const onSubmit = async (data: z.infer<typeof ProjectDetailsFormSchema>) => {
    setSubmitted(true);

    mutation.mutate(data);
    form.reset();
   
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center text-zinc-500 group-hover:text-zinc-700 -my-2">
          <FolderPlus size={16} />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Project</DialogTitle>
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
              <Button type="submit" disabled={submitted}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
