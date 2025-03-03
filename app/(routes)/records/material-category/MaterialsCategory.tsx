"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const categories = [
  { id: 1, type: "Masonry" },
  { id: 2, type: "Metal Works" },
  { id: 3, type: "Woodworks" },
  // Add more categories as needed
];

export default function MaterialCategory() {
  const [material, setMaterial] = useState({
    name: "",
    description: "",
    unit: "",
    category: categories[0].type, // Set a default category to avoid hydration mismatch
  });

  // Ensure the category is set correctly on the client side
  useEffect(() => {
    setMaterial((prev) => ({ ...prev, category: categories[0].type }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaterial({ ...material, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setMaterial({ ...material, category: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Material Data Submitted: ", material);
  };

  return (
    <Card className="w-[350px] mx-auto p-6">
      <CardHeader>
        <CardTitle>Add New Material</CardTitle>
        <CardDescription>Fill in the details to add a new material.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Material Name</Label>
            <Input name="name" value={material.name} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description (Size)</Label>
            <Input name="description" value={material.description} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="unit">Unit (Measurement)</Label>
            <Input name="unit" value={material.unit} onChange={handleChange} required />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={handleCategoryChange} value={material.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.type}>
                    {category.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Add Material</Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </CardFooter>
    </Card>
  );
}
