"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase/client"

const formSchema = z.object({
  material: z.string().min(1, "Name is required"),
  cost: z.coerce.number().min(1, "Cost must be at least 1"),
  date: z.string().min(1, "Date is required"),
});

export default function addMaterialHistory({ onMaterialHistoryAdded }: { onMaterialHistoryAdded: (newMaterialHistory: any) => void }) {
  const [loader, setLoader] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material: "",
      cost: 1,
      date: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoader(true);
    try {
      const { data, error } = await supabase.from('material_history').insert([values]).select();

      if (error) {
        throw error;
      }

      if (data) {
        console.log("New Material History Added", data);
        toast.success("New Material History Added");
        onMaterialHistoryAdded(data[0]);
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoader(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-full mx-auto py-10 px-4">
        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Material</FormLabel>
              <FormControl>
                <Input placeholder="Enter material name" {...field} />
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
                <Input
                  type="number"
                  placeholder="Enter cost"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                />
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
                <Input type="date" placeholder="Enter date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-1 md:col-span-2">
          <Button type="submit" className="w-full" disabled={loader}>
            {loader ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}