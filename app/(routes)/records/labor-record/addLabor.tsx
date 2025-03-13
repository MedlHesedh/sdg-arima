"use client"
import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/utils/supabase/client"

const formSchema = z.object({
  labor: z.string().min(1, "Name is required"),
  quantity: z.coerce.number().min(1, "Quantity is required"),
  category: z.string().min(1, "Category is required"),
});

export default function AddLaborForm({ onLaborAdded }: { onLaborAdded: (newLabor: any) => void }) {
  const [loader, setLoader] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { labor: "", quantity: 1, category: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoader(true);
    try {
      const { data, error } = await supabase.from("labor_adding").insert([values]).select();

      if (data) {
        console.log("New Labor Added", data);
        toast.success("New Labor Added!");
        onLaborAdded(data[0]); // Update UI
        form.reset(); // Clear form
      }
      if (error) {
        console.error("Error", error);
        toast.error("Server-side error");
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
        {/* Name of Labor */}
        <FormField
          control={form.control}
          name="labor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name of Labor</FormLabel>
              <FormControl>
                <Input placeholder="Enter labor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Masonry">Masonry</SelectItem>
                  <SelectItem value="Metal Works">Metal Works</SelectItem>
                  <SelectItem value="Woodworks">Woodworks</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <Button type="submit" className="w-full" disabled={loader}>
            {loader ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
