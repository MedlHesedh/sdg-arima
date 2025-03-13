"use client"
import { useState } from "react"
import { toast } from "sonner" // Ensure this import is correct
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
  material: z.string().min(1, "Material name is required"),
  unit: z.string().min(1, "Unit is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export default function addMaterial({ onMaterialAdded }: { onMaterialAdded: (newMaterial: any) => void }) {
  const [loader, setLoader] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { material: "", unit: "", category: "", quantity: 1 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoader(true);
    try {
      const { data, error } = await supabase.from('material_adding').insert([values]).select();

      if (data) {
        console.log("New Material Added", data);
        toast.success("New Material Added"); // Ensure this is called correctly
        onMaterialAdded(data[0]); // Update the list immediately
        form.reset(); // Clear the form after submission
      }
      if (error) {
        console.error("Error", error);
        toast.error("Server-side error"); // Ensure this is called correctly
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again."); // Ensure this is called correctly
    } finally {
      setLoader(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-full mx-auto py-10 px-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit of Measurement</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lot">Lot</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                    <SelectItem value="cu_m">Cubic Meters</SelectItem>
                    <SelectItem value="sq_m">Square Meters</SelectItem>
                    <SelectItem value="kgs">Kilograms</SelectItem>
                    <SelectItem value="m">Meters</SelectItem>
                    <SelectItem value="rolls">Rolls</SelectItem>
                    <SelectItem value="pcs">Pieces</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                    <SelectItem value="gal">Gallon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="General Requirements">General Requirements</SelectItem>
                    <SelectItem value="Site Preparation and Earthworks">Site Preparation and Earthworks</SelectItem>
                    <SelectItem value="Masonry Works">Masonry Works</SelectItem>
                    <SelectItem value="Concrete Works (Cast-in Place)">Concrete Works (Cast-in Place)</SelectItem>
                    <SelectItem value="Metal Works">Metal Works</SelectItem>
                    <SelectItem value="Moisture and Thermal Protection">Moisture and Thermal Protection</SelectItem>
                    <SelectItem value="Floor and Wall Finishes">Floor and Wall Finishes</SelectItem>
                    <SelectItem value="Ceiling Works">Ceiling Works</SelectItem>
                    <SelectItem value="Windows">Windows</SelectItem>
                    <SelectItem value="Doors">Doors</SelectItem>
                    <SelectItem value="Painting Works (Davies Or Boysen Brand)">Painting Works (Davies Or Boysen Brand)</SelectItem>
                    <SelectItem value="Electrical Works">Electrical Works</SelectItem>
                    <SelectItem value="Plumbing Works">Plumbing Works</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <Button type="submit" className="w-full" disabled={loader}>
          {loader ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
