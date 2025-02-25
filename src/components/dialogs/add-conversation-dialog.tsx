"use client";

import { useState } from "react";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import { saveDocToDb } from "@/app/actions/save-doc-to-db";
import { ConversationFormSchema } from "@/lib/conversation-form-schema";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2Icon,
  Brain,
  Loader,
  Plus,
  MessageSquareText,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";


interface ConversationDialogProps {
  projectId: string;
  userId: string;
}

export const ConversationDialog = ({
  projectId,
  userId,
}: ConversationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof ConversationFormSchema>>({
    resolver: zodResolver(ConversationFormSchema),
    defaultValues: {
      conversationFlowName: "",
      businessIssue: "",
      hypotheses: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "hypotheses",
  });

  const onSubmit = async (formData: z.infer<typeof ConversationFormSchema>) => {
    setSubmitted(true);

    const prompt = `Your client's business issue is: ${
      formData.businessIssue
    }. The hypotheses your client wants to test about the business issue are: ${formData.hypotheses
      .map((hypothesis, index) => `Hypothesis ${index + 1}: ${hypothesis.name}`)
      .join(", ")} \n`;

    try {
      const response = await fetch("/api/create-conversation-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, projectId }),
      });

      if (!response.ok) throw new Error("Failed to generate conversation flow");

      const responseData = await response.json();

      const newDocument = {
        id: "",
        projectId,
        userId,
        title: `Conversation Guide - ${formData.conversationFlowName}`,
        interviewee: "",
        interviewDate: "",
        content: responseData.text,
        fileUrl: "",
        docType: "conversation",
        createDate: new Date().toLocaleDateString("en-AU"),
        updateDate: new Date().toLocaleDateString("en-AU"),
      };

      await saveDocToDb(newDocument, projectId);
      queryClient.invalidateQueries({queryKey: [ "documents", projectId] });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }

    setSubmitted(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center text-zinc-500 group-hover:text-zinc-700 -my-2"
        >
          <MessageSquareText size={16} />
          Create a Conversation Flow
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Conversation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="conversationFlowName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conversation Flow Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your conversation flow name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Issue</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description of your business issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end space-x-2">
                  <FormField
                    control={form.control}
                    name={`hypotheses.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Hypothesis {index + 1}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a hypothesis to test"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "" })}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Hypothesis
            </Button>
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitted}>
                {submitted ? (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    <Loader className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
