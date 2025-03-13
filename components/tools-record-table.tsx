"use client"

import { useState, useEffect } from "react"
import { Plus, QrCode, Edit, AlertTriangle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { QRCodeGenerator } from "@/components/qr-code-generator"
import { supabase } from "@/utils/supabase/client"

// Initial empty state - data will be loaded from Supabase
const initialTools: Tool[] = []

type Tool = {
  id: string
  name: string
  quantity: number
  status: "Available" | "Not Available" | "Under Maintenance"
  condition_notes: string
  last_maintenance: string
  serial_numbers: string[]
}

export function ToolsRecordTable() {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTool, setIsAddingTool] = useState(false)
  const [isEditingTool, setIsEditingTool] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [selectedSerialNumber, setSelectedSerialNumber] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: "",
    quantity: 1,
    status: "Available",
    condition_notes: "",
    last_maintenance: new Date().toISOString().split("T")[0],
    serial_numbers: [""],
  })

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true)

        // Use the Supabase client to fetch tools data
        const { data, error } = await supabase.from("tools").select(`
            *,
            tool_serial_numbers(*)
          `)

        if (error) throw error

        // Transform the data to match our component's expected format
        const formattedTools = data.map((tool) => ({
          id: tool.id,
          name: tool.name,
          quantity: tool.quantity,
          status: tool.status,
          condition_notes: tool.condition_notes || "",
          last_maintenance: tool.last_maintenance,
          serial_numbers: tool.tool_serial_numbers.map((sn: any) => sn.serial_number),
        }))

        setTools(formattedTools)
      } catch (error) {
        console.error("Error fetching tools:", error)
        toast({
          title: "Error",
          description: "Failed to load tools inventory",
          variant: "destructive",
        })
        // Set empty array if there's an error
        setTools([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [])

  const handleAddTool = async () => {
    if (!newTool.name || !newTool.quantity || newTool.quantity < 1 || !newTool.serial_numbers?.length) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      // Insert the tool into the tools table
      const { data: toolData, error: toolError } = await supabase
        .from("tools")
        .insert({
          name: newTool.name,
          quantity: newTool.quantity,
          status: newTool.status,
          condition_notes: newTool.condition_notes,
          last_maintenance: newTool.last_maintenance,
        })
        .select()

      if (toolError) throw toolError

      const toolId = toolData[0].id

      // Insert the serial numbers
      const serialNumbersToInsert =
        newTool.serial_numbers?.map((serialNumber) => ({
          tool_id: toolId,
          serial_number: serialNumber,
          status: newTool.status,
        })) || []

      const { error: serialNumberError } = await supabase.from("tool_serial_numbers").insert(serialNumbersToInsert)

      if (serialNumberError) throw serialNumberError

      // Refresh the tools list
      const { data: updatedTools, error: fetchError } = await supabase.from("tools").select(`
          *,
          tool_serial_numbers(*)
        `)

      if (fetchError) throw fetchError

      // Transform the data to match our component's expected format
      const formattedTools = updatedTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        quantity: tool.quantity,
        status: tool.status,
        condition_notes: tool.condition_notes || "",
        last_maintenance: tool.last_maintenance,
        serial_numbers: tool.tool_serial_numbers.map((sn: any) => sn.serial_number),
      }))

      setTools(formattedTools)

      // Reset the form
      setNewTool({
        name: "",
        quantity: 1,
        status: "Available",
        condition_notes: "",
        last_maintenance: new Date().toISOString().split("T")[0],
        serial_numbers: [""],
      })
      setIsAddingTool(false)

      toast({
        title: "Success",
        description: "Tool added to inventory",
      })
    } catch (error) {
      console.error("Error adding tool:", error)
      toast({
        title: "Error",
        description: "Failed to add tool to inventory",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTool = async () => {
    if (!selectedTool) return

    try {
      // Update the tool in the tools table
      const { error: toolError } = await supabase
        .from("tools")
        .update({
          name: selectedTool.name,
          quantity: selectedTool.quantity,
          status: selectedTool.status,
          condition_notes: selectedTool.condition_notes,
          last_maintenance: selectedTool.last_maintenance,
        })
        .eq("id", selectedTool.id)

      if (toolError) throw toolError

      // Get existing serial numbers
      const { data: existingSerialNumbers, error: fetchError } = await supabase
        .from("tool_serial_numbers")
        .select("id, serial_number")
        .eq("tool_id", selectedTool.id)

      if (fetchError) throw fetchError

      // Determine which serial numbers to add, update, or delete
      const existingMap = new Map(existingSerialNumbers.map((sn: any) => [sn.serial_number, sn.id]))
      const newSerialNumbers = selectedTool.serial_numbers.filter((sn) => !existingMap.has(sn))
      const toDelete = existingSerialNumbers
        .filter((existing: any) => !selectedTool.serial_numbers.includes(existing.serial_number))
        .map((sn: any) => sn.id)

      // Delete removed serial numbers
      if (toDelete.length > 0) {
        const { error: deleteError } = await supabase.from("tool_serial_numbers").delete().in("id", toDelete)

        if (deleteError) throw deleteError
      }

      // Add new serial numbers
      if (newSerialNumbers.length > 0) {
        const serialNumbersToInsert = newSerialNumbers.map((serialNumber) => ({
          tool_id: selectedTool.id,
          serial_number: serialNumber,
          status: selectedTool.status,
        }))

        const { error: insertError } = await supabase.from("tool_serial_numbers").insert(serialNumbersToInsert)

        if (insertError) throw insertError
      }

      // Update existing serial numbers status
      const { error: updateError } = await supabase
        .from("tool_serial_numbers")
        .update({ status: selectedTool.status })
        .eq("tool_id", selectedTool.id)
        .not("id", "in", toDelete)

      if (updateError) throw updateError

      // Refresh the tools list
      const { data: updatedTools, error: refreshError } = await supabase.from("tools").select(`
          *,
          tool_serial_numbers(*)
        `)

      if (refreshError) throw refreshError

      // Transform the data to match our component's expected format
      const formattedTools = updatedTools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        quantity: tool.quantity,
        status: tool.status,
        condition_notes: tool.condition_notes || "",
        last_maintenance: tool.last_maintenance,
        serial_numbers: tool.tool_serial_numbers.map((sn: any) => sn.serial_number),
      }))

      setTools(formattedTools)
      setIsEditingTool(false)

      toast({
        title: "Success",
        description: "Tool information updated",
      })
    } catch (error) {
      console.error("Error updating tool:", error)
      toast({
        title: "Error",
        description: "Failed to update tool information",
        variant: "destructive",
      })
    }
  }

  const handleShowQRCode = (tool: Tool, serialNumber: string) => {
    setSelectedTool(tool)
    setSelectedSerialNumber(serialNumber)
    setShowQRCode(true)
  }

  const handleEditTool = (tool: Tool) => {
    setSelectedTool(tool)
    setIsEditingTool(true)
  }

  const handleAddSerialNumber = () => {
    setNewTool({
      ...newTool,
      serial_numbers: [...(newTool.serial_numbers || []), ""],
    })
  }

  const handleRemoveSerialNumber = (index: number) => {
    const updatedSerialNumbers = [...(newTool.serial_numbers || [])]
    updatedSerialNumbers.splice(index, 1)
    setNewTool({
      ...newTool,
      serial_numbers: updatedSerialNumbers,
    })
  }

  const handleUpdateSerialNumber = (index: number, value: string) => {
    const updatedSerialNumbers = [...(newTool.serial_numbers || [])]
    updatedSerialNumbers[index] = value
    setNewTool({
      ...newTool,
      serial_numbers: updatedSerialNumbers,
    })
  }

  const handleEditSerialNumber = (index: number, value: string) => {
    if (!selectedTool) return
    const updatedSerialNumbers = [...selectedTool.serial_numbers]
    updatedSerialNumbers[index] = value
    setSelectedTool({
      ...selectedTool,
      serial_numbers: updatedSerialNumbers,
    })
  }

  const handleAddEditSerialNumber = () => {
    if (!selectedTool) return
    setSelectedTool({
      ...selectedTool,
      serial_numbers: [...selectedTool.serial_numbers, ""],
      quantity: selectedTool.quantity + 1,
    })
  }

  const handleRemoveEditSerialNumber = (index: number) => {
    if (!selectedTool) return
    const updatedSerialNumbers = [...selectedTool.serial_numbers]
    updatedSerialNumbers.splice(index, 1)
    setSelectedTool({
      ...selectedTool,
      serial_numbers: updatedSerialNumbers,
      quantity: selectedTool.quantity - 1,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "Not Available":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "Under Maintenance":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter tools based on search term and status filter
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.serial_numbers.some((sn) => sn.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || tool.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by tool name or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Not Available">Not Available</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Sheet open={isAddingTool} onOpenChange={setIsAddingTool}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tool
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add New Tool</SheetTitle>
                <SheetDescription>Add a new tool to your inventory</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Tool Name</Label>
                  <Input
                    id="tool-name"
                    value={newTool.name}
                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                    placeholder="e.g. Concrete Mixer, Power Drill"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-quantity">Quantity</Label>
                  <Input
                    id="tool-quantity"
                    type="number"
                    min="1"
                    value={newTool.quantity?.toString() || "1"}
                    onChange={(e) => {
                      const quantity = Number.parseInt(e.target.value)
                      if (quantity < 1) return

                      // Adjust serial numbers array length based on quantity
                      let serialNumbers = [...(newTool.serial_numbers || [])]
                      if (quantity > serialNumbers.length) {
                        // Add empty serial numbers
                        while (serialNumbers.length < quantity) {
                          serialNumbers.push("")
                        }
                      } else if (quantity < serialNumbers.length) {
                        // Remove excess serial numbers
                        serialNumbers = serialNumbers.slice(0, quantity)
                      }

                      setNewTool({
                        ...newTool,
                        quantity: quantity,
                        serial_numbers: serialNumbers,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-status">Status</Label>
                  <Select
                    value={newTool.status}
                    onValueChange={(value) =>
                      setNewTool({
                        ...newTool,
                        status: value as "Available" | "Not Available" | "Under Maintenance",
                      })
                    }
                  >
                    <SelectTrigger id="tool-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Not Available">Not Available</SelectItem>
                      <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-maintenance">Last Maintenance Date</Label>
                  <Input
                    id="tool-maintenance"
                    type="date"
                    value={newTool.last_maintenance}
                    onChange={(e) => setNewTool({ ...newTool, last_maintenance: e.target.value })}
                  />
                </div>

                {newTool.status === "Under Maintenance" && (
                  <div className="space-y-2">
                    <Label htmlFor="tool-notes">Condition Notes</Label>
                    <Textarea
                      id="tool-notes"
                      value={newTool.condition_notes}
                      onChange={(e) => setNewTool({ ...newTool, condition_notes: e.target.value })}
                      placeholder="Describe the maintenance needs or issues"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Serial Numbers</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddSerialNumber}
                      disabled={(newTool.serial_numbers?.length || 0) >= (newTool.quantity || 1)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newTool.serial_numbers?.map((serialNumber, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={serialNumber}
                          onChange={(e) => handleUpdateSerialNumber(index, e.target.value)}
                          placeholder={`Serial number ${index + 1}`}
                        />
                        {newTool.serial_numbers && newTool.serial_numbers.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSerialNumber(index)}
                          >
                            <span className="sr-only">Remove</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddingTool(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTool}>Add Tool</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Tools Inventory</CardTitle>
              <CardDescription>
                Manage your construction tools inventory, status, and maintenance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tool Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Maintenance</TableHead>
                    <TableHead>Serial Numbers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mt-2">Loading tools inventory...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredTools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-muted-foreground">No tools found matching your search criteria</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTools.map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">{tool.name}</TableCell>
                        <TableCell>{tool.quantity}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tool.status)}>{tool.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDate(tool.last_maintenance)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tool.serial_numbers.map((serialNumber, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => handleShowQRCode(tool, serialNumber)}
                              >
                                {serialNumber}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditTool(tool)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground mt-4">Loading tools inventory...</p>
              </div>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tools found matching your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <Card key={tool.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{tool.name}</CardTitle>
                      <Badge className={getStatusColor(tool.status)}>{tool.status}</Badge>
                    </div>
                    <CardDescription>Quantity: {tool.quantity}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium">Last Maintenance</p>
                        <p className="text-sm text-muted-foreground">{formatDate(tool.last_maintenance)}</p>
                      </div>

                      {tool.condition_notes && (
                        <div>
                          <p className="text-sm font-medium flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                            Condition Notes
                          </p>
                          <p className="text-sm text-muted-foreground">{tool.condition_notes}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium mb-1">Serial Numbers</p>
                        <div className="flex flex-wrap gap-1">
                          {tool.serial_numbers.map((serialNumber, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer"
                              onClick={() => handleShowQRCode(tool, serialNumber)}
                            >
                              <QrCode className="h-3 w-3 mr-1" />
                              {serialNumber}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleEditTool(tool)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Tool
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for {selectedTool?.name}</DialogTitle>
            <DialogDescription>Serial Number: {selectedSerialNumber}</DialogDescription>
          </DialogHeader>
          <QRCodeGenerator serialNumber={selectedSerialNumber} toolName={selectedTool?.name || ""} />
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your phone's camera or a QR code scanner app to access this tool's details.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tool Sheet */}
      <Sheet open={isEditingTool} onOpenChange={setIsEditingTool}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Tool</SheetTitle>
            <SheetDescription>Update tool information and status</SheetDescription>
          </SheetHeader>
          {selectedTool && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tool-name">Tool Name</Label>
                <Input
                  id="edit-tool-name"
                  value={selectedTool.name}
                  onChange={(e) => setSelectedTool({ ...selectedTool, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tool-quantity">Quantity</Label>
                <Input
                  id="edit-tool-quantity"
                  type="number"
                  min="1"
                  value={selectedTool.quantity.toString()}
                  onChange={(e) => {
                    const quantity = Number.parseInt(e.target.value)
                    if (quantity < 1) return

                    // Adjust serial numbers array length based on quantity
                    let serialNumbers = [...selectedTool.serial_numbers]
                    if (quantity > serialNumbers.length) {
                      // Add empty serial numbers
                      while (serialNumbers.length < quantity) {
                        serialNumbers.push("")
                      }
                    } else if (quantity < serialNumbers.length) {
                      // Remove excess serial numbers
                      serialNumbers = serialNumbers.slice(0, quantity)
                    }

                    setSelectedTool({
                      ...selectedTool,
                      quantity: quantity,
                      serial_numbers: serialNumbers,
                    })
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tool-status">Status</Label>
                <Select
                  value={selectedTool.status}
                  onValueChange={(value) =>
                    setSelectedTool({
                      ...selectedTool,
                      status: value as "Available" | "Not Available" | "Under Maintenance",
                    })
                  }
                >
                  <SelectTrigger id="edit-tool-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tool-maintenance">Last Maintenance Date</Label>
                <Input
                  id="edit-tool-maintenance"
                  type="date"
                  value={selectedTool.last_maintenance}
                  onChange={(e) => setSelectedTool({ ...selectedTool, last_maintenance: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tool-notes">Condition Notes</Label>
                <Textarea
                  id="edit-tool-notes"
                  value={selectedTool.condition_notes}
                  onChange={(e) => setSelectedTool({ ...selectedTool, condition_notes: e.target.value })}
                  placeholder="Describe the maintenance needs or issues"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Serial Numbers</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEditSerialNumber}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedTool.serial_numbers.map((serialNumber, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={serialNumber}
                        onChange={(e) => handleEditSerialNumber(index, e.target.value)}
                        placeholder={`Serial number ${index + 1}`}
                      />
                      {selectedTool.serial_numbers.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveEditSerialNumber(index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditingTool(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTool}>Update Tool</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

