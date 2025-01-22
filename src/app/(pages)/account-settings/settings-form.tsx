"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateBusinessDetails } from "@/app/actions/update-business-details";
import { PrivacyDialog } from "@/components/legal/privacy-dialog";
import { TOUDialog } from "@/components/legal/tou-dialog";
import Link from "next/link";

interface SettingsFormProps {
  userId: string;
  businessDetails: string;
  businessStage: string;
  marketChannel: string;
}

const SettingsFormSchema = z.object({
  businessDetails: z
    .string()
    .min(2, { message: "Please enter your business details" }),
  businessStage: z
    .string()
    .min(2, { message: "Please enter the stage of your business" }),
  marketChannel: z
    .string()
    .min(2, { message: "Please enter the market channel of your business" }),
});

export const SettingsForm = ({
  userId,
  businessDetails,
  businessStage,
  marketChannel,
}: SettingsFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      businessDetails: businessDetails,
      businessStage: businessStage,
      marketChannel: marketChannel,
    },
  });

  const onSubmit = async (data: z.infer<typeof SettingsFormSchema>) => {
    setSubmitted(true);
    await updateBusinessDetails(
      userId,
      data.businessDetails,
      data.businessStage,
      data.marketChannel
    );
    setSubmitted(false);
    router.push(`/home`);
  };

  return (
    <div className="w-full mx-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="businessDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Business Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter a description of your business"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Business Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Revenue generating">Revenue generating</SelectItem>
                    <SelectItem value="MVP">MVP</SelectItem>
                    <SelectItem value="Pre-product">Pre-product</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="marketChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Market</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your market channel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="B2C">B2C</SelectItem>
                    <SelectItem value="B2B">B2B</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between items-center gap-4 space-y-4">
            <Button type="submit" disabled={submitted} >
              Save
            </Button>

            <div className="flex sm:flex-row flex-col space-x-4 ">
              <PrivacyDialog />
              <TOUDialog />
            </div>
          </div>
        </form>
      </Form>
      <div className="mt-6">
        <Button asChild  className="w-full">
          <Link href="https://www.loom.com/share/2220733b64c54ece9da24f88118c9389?sid=6a6dc055-eae5-41f3-9b0e-8f7adae7c144">
            Watch the Brandhook Discover AI Tool Explainer
          </Link>
        </Button>
      </div>
    </div>
  );
};