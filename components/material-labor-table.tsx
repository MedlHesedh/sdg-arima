"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, you would fetch this from an API
const initialMaterialsLabor = [
  {
    id: "1",
    type: "Labor",
    name: "Carpenter",
    quantity: 4,
    rate: 350,
    unit: "day",
    duration: 14,
    totalCost: 19600,
  },
  {
    id: "2",
    type: "Labor",
    name: "Mason",
    quantity: 3,
    rate: 400,
    unit: "day",
    duration: 10,
    totalCost: 12000,
  },
  {
    id: "3",
    type: "Material",
    name: "Cement",
    quantity: 100,
    rate: 250,
    unit: "bag",
    duration: null,
    totalCost: 25000,
  },
  {
    id: "4",
    type: "Material",
    name: "Steel Bars",
    quantity: 50,
    rate: 1200,
    unit: "pc",
    duration: null,
    totalCost: 60000,
  },
]

type MaterialLaborItem = {
  id: string
  type: "Material" | "Labor"
  name: string
  quantity: number
  rate: number
  unit: string
  duration: number | null
  totalCost: number
}

export function MaterialLaborTable({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<MaterialLaborItem[]>(initialMaterialsLabor)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [newItem, setNewItem] = useState<Partial<MaterialLaborItem>>({
    type: "Material",
    name: "",
    quantity: 0,
    rate: 0,
    unit: "",
    duration: null,
  })

  const handleAddItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.rate || !newItem.unit) {
      return
    }

    const totalCost =
      newItem.type === "Labor" && newItem.duration
        ? (newItem.quantity || 0) * (newItem.rate || 0) * (newItem.duration || 0)
        : (newItem.quantity || 0) * (newItem.rate || 0)

    const item: MaterialLaborItem = {
      id: Date.now().toString(),
      type: newItem.type as "Material" | "Labor",
      name: newItem.name || "",
      quantity: newItem.quantity || 0,
      rate: newItem.rate || 0,
      unit: newItem.unit || "",
      duration: newItem.type === "Labor" ? newItem.duration || 0 : null,
      totalCost,
    }

    setItems([...items, item])
    setNewItem({
      type: "Material",
      name: "",
      quantity: 0,
      rate: 0,
      unit: "",
      duration: null,
    })
    setIsAddingItem(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount)
  }

  const totalMaterialCost = items
    .filter((item) => item.type === "Material")
    .reduce((sum, item) => sum + item.totalCost, 0)

  const totalLaborCost = items.filter((item) => item.type === "Labor").reduce((sum, item) => sum + item.totalCost, 0)

  const grandTotal = totalMaterialCost + totalLaborCost

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Materials & Labor Assignment</h2>
        <Sheet open={isAddingItem} onOpenChange={setIsAddingItem}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Material or Labor</SheetTitle>
              <SheetDescription>Add a new material or labor item to the project</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="item-type">Type</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value) =>
                    setNewItem({
                      ...newItem,
                      type: value as "Material" | "Labor",
                      duration: value === "Labor" ? 0 : null,
                    })
                  }
                >
                  <SelectTrigger id="item-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Labor">Labor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder={newItem.type === "Labor" ? "e.g. Carpenter, Mason" : "e.g. Cement, Steel Bars"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    type="number"
                    min="0"
                    value={newItem.quantity?.toString() || ""}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-unit">Unit</Label>
                  <Input
                    id="item-unit"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder={newItem.type === "Labor" ? "e.g. day, hour" : "e.g. bag, pc, kg"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-rate">Rate (PHP)</Label>
                <Input
                  id="item-rate"
                  type="number"
                  min="0"
                  value={newItem.rate?.toString() || ""}
                  onChange={(e) => setNewItem({ ...newItem, rate: Number.parseFloat(e.target.value) })}
                  placeholder="Rate per unit"
                />
              </div>

              {newItem.type === "Labor" && (
                <div className="space-y-2">
                  <Label htmlFor="item-duration">Duration (days)</Label>
                  <Input
                    id="item-duration"
                    type="number"
                    min="0"
                    value={newItem.duration?.toString() || ""}
                    onChange={(e) => setNewItem({ ...newItem, duration: Number.parseFloat(e.target.value) })}
                    placeholder="Number of days"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>Add Item</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials & Labor List</CardTitle>
          <CardDescription>Manage materials and labor for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Rate (PHP)</TableHead>
                <TableHead className="text-right">Unit</TableHead>
                {items.some((item) => item.type === "Labor") && <TableHead className="text-right">Duration</TableHead>}
                <TableHead className="text-right">Total Cost</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                    No materials or labor items added yet
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.rate)}</TableCell>
                    <TableCell className="text-right">{item.unit}</TableCell>
                    {items.some((item) => item.type === "Labor") && (
                      <TableCell className="text-right">{item.duration !== null ? item.duration : "-"}</TableCell>
                    )}
                    <TableCell className="text-right font-medium">{formatCurrency(item.totalCost)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Material Cost:</span>
              <span className="font-medium">{formatCurrency(totalMaterialCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Labor Cost:</span>
              <span className="font-medium">{formatCurrency(totalLaborCost)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Grand Total:</span>
              <span className="font-semibold">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

