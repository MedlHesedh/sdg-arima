"use client";

import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";

// Define the type for a labor history entry
export type LaborHistory = {
  id: string;
  labor: string;
  cost: string;
  date: string;
};

// Define props for the component
interface AddLaborHistoryFormProps {
  onLaborAdded: (newLabor: LaborHistory) => void;
}

// Validation schema
const formSchema = z.object({
  labor: z.string().min(1, "Labor Name is required"),
  cost: z.string().min(1, "Cost is required"),
  date: z.string().min(1, "Date is required"),
});

export default function AddLaborHistoryForm({ onLaborAdded }: AddLaborHistoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labor: "",
      cost: "",
      date: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const newLabor: LaborHistory = {
        id: crypto.randomUUID(), // Generate a unique ID for the new entry
        ...values,
      };

      // Call the callback function to update the parent component
      onLaborAdded(newLabor);

      toast.success("Labor history added successfully!");

      // Reset form fields
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full mx-auto py-10 px-4"
      >
        <FormField
          control={form.control}
          name="labor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labor Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter labor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input placeholder="Enter cost" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1 md:col-span-2">
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
