"use client"

import { useState, useEffect } from "react"
import { QrCode, Plus, Trash2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useToolsAssignmentIntegration } from "./tools-assignment-integration"
import { supabase } from "@/utils/supabase/client"
import { QRCodeGenerator } from "./qr-code-generator"

type Tool = {
  id: string
  name: string
  serialNumber: string
  status: "Available" | "Not Available" | "Under Maintenance"
  assignedDate: string | null
  returnDate: string | null
  assignmentId?: string
}

export function ToolsAssignmentTable({ projectId }: { projectId: string }) {
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingTool, setIsAddingTool] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [availableTools, setAvailableTools] = useState<{ id: string; name: string; serialNumbers: string[] }[]>([])
  const [newTool, setNewTool] = useState<Partial<Tool>>({
    name: "",
    serialNumber: "",
    assignedDate: new Date().toISOString().split("T")[0],
    returnDate: null,
  })

  const { assignToolToProject, returnToolFromProject } = useToolsAssignmentIntegration()

  // Fetch tools assigned to this project and available tools
  useEffect(() => {
    const fetchTools = async () => {
      try {
        setIsLoading(true)

        // Fetch tools assigned to this project
        const { data: assignedTools, error: assignedError } = await supabase
          .from("tool_assignments")
          .select(`
          id,
          assigned_date,
          return_date,
          status,
          tool_serial_id,
          tool_serial_numbers(
            id,
            serial_number,
            status,
            tool_id,
            tools(
              id,
              name
            )
          )
        `)
          .eq("project_id", projectId)
          .eq("status", "Assigned")

        if (assignedError) throw assignedError

        // Transform the data to match our component's expected format
        const formattedTools = assignedTools
          .filter((assignment) => assignment.tool_serial_numbers && assignment.tool_serial_numbers.length > 0)
          .map((assignment) => {
            const toolSerial = assignment.tool_serial_numbers[0]
            const tool = toolSerial.tools && toolSerial.tools.length > 0 ? toolSerial.tools[0] : null

            if (!tool) return null

            return {
              id: tool.id,
              name: tool.name,
              serialNumber: toolSerial.serial_number,
              status: toolSerial.status as "Available" | "Not Available" | "Under Maintenance",
              assignedDate: assignment.assigned_date,
              returnDate: assignment.return_date,
              assignmentId: assignment.id,
            }
          })
          .filter((tool) => tool !== null)

        setTools(formattedTools as Tool[])

        // Fetch available tools for assignment
        const { data: availableToolsData, error: availableError } = await supabase
          .from("tools")
          .select(`
          id,
          name,
          tool_serial_numbers(
            id,
            serial_number,
            status
          )
        `)
          .order("name")

        if (availableError) throw availableError

        // Transform the data to group by tool name with available serial numbers
        const formattedAvailableTools = availableToolsData
          .map((tool) => ({
            id: tool.id,
            name: tool.name,
            serialNumbers: tool.tool_serial_numbers
              .filter((sn: any) => sn.status === "Available")
              .map((sn: any) => sn.serial_number),
          }))
          .filter((tool) => tool.serialNumbers.length > 0) // Only include tools with available serial numbers

        setAvailableTools(formattedAvailableTools)
      } catch (error) {
        console.error("Error fetching tools:", error)
        toast({
          title: "Error",
          description: "Failed to load tools. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTools()
  }, [projectId])

  const handleAddTool = async () => {
    if (!newTool.name || !newTool.serialNumber) {
      toast({
        title: "Validation Error",
        description: "Please select a tool and serial number",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await assignToolToProject(
        projectId,
        newTool.serialNumber,
        newTool.assignedDate || new Date().toISOString().split("T")[0],
        newTool.returnDate || undefined,
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      // Find the tool details from available tools
      const toolDetails = availableTools.find((t) => t.id === newTool.name)

      // Add the new tool to the list
      const newToolEntry: Tool = {
        id: newTool.name || "",
        name: toolDetails?.name || "Unknown Tool",
        serialNumber: newTool.serialNumber,
        status: "Not Available",
        assignedDate: newTool.assignedDate || new Date().toISOString().split("T")[0],
        returnDate: newTool.returnDate ?? null,
        assignmentId: result.assignment?.id,
      }

      setTools([...tools, newToolEntry])

      // Update available tools list
      setAvailableTools(
        availableTools
          .map((tool) => {
            if (tool.id === newTool.name) {
              return {
                ...tool,
                serialNumbers: tool.serialNumbers.filter((sn) => sn !== newTool.serialNumber),
              }
            }
            return tool
          })
          .filter((tool) => tool.serialNumbers.length > 0),
      )

      // Reset form
      setNewTool({
        name: "",
        serialNumber: "",
        assignedDate: new Date().toISOString().split("T")[0],
        returnDate: null,
      })

      setIsAddingTool(false)

      toast({
        title: "Success",
        description: "Tool assigned to project successfully",
      })
    } catch (error) {
      console.error("Error adding tool:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to assign tool to project",
        variant: "destructive",
      })
    }
  }

  const handleReturnTool = async (tool: Tool) => {
    if (!tool.assignmentId) {
      toast({
        title: "Error",
        description: "Cannot return tool: missing assignment information",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await returnToolFromProject(tool.assignmentId)

      if (!result.success) {
        throw new Error(result.error)
      }

      // Remove the tool from the list
      setTools(tools.filter((t) => t.assignmentId !== tool.assignmentId))

      // Update available tools list
      const toolExists = availableTools.some((t) => t.id === tool.id)

      if (toolExists) {
        setAvailableTools(
          availableTools.map((t) => {
            if (t.id === tool.id) {
              return {
                ...t,
                serialNumbers: [...t.serialNumbers, tool.serialNumber],
              }
            }
            return t
          }),
        )
      } else {
        // Add the tool to available tools if it doesn't exist
        setAvailableTools([
          ...availableTools,
          {
            id: tool.id,
            name: tool.name,
            serialNumbers: [tool.serialNumber],
          },
        ])
      }

      toast({
        title: "Success",
        description: `Tool ${tool.serialNumber} has been returned`,
      })
    } catch (error) {
      console.error("Error returning tool:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to return tool",
        variant: "destructive",
      })
    }
  }

  const handleShowQRCode = (tool: Tool) => {
    setSelectedTool(tool)
    setShowQRCode(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tools Assignment</h2>
        <Sheet open={isAddingTool} onOpenChange={setIsAddingTool}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Tool</SheetTitle>
              <SheetDescription>Add a new tool to the project</SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tool-name">Tool</Label>
                <Select
                  value={newTool.name}
                  onValueChange={(value) => {
                    setNewTool({
                      ...newTool,
                      name: value,
                      serialNumber: "", // Reset serial number when tool changes
                    })
                  }}
                >
                  <SelectTrigger id="tool-name">
                    <SelectValue placeholder="Select a tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTools.map((tool) => (
                      <SelectItem key={tool.id} value={tool.id}>
                        {tool.name} ({tool.serialNumbers.length} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tool-serial">Serial Number</Label>
                <Select
                  value={newTool.serialNumber}
                  onValueChange={(value) => setNewTool({ ...newTool, serialNumber: value })}
                  disabled={!newTool.name}
                >
                  <SelectTrigger id="tool-serial">
                    <SelectValue placeholder="Select serial number" />
                  </SelectTrigger>
                  <SelectContent>
                    {newTool.name &&
                      availableTools
                        .find((t) => t.id === newTool.name)
                        ?.serialNumbers.map((serialNumber) => (
                          <SelectItem key={serialNumber} value={serialNumber}>
                            {serialNumber}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tool-assigned">Assigned Date</Label>
                <Input
                  id="tool-assigned"
                  type="date"
                  value={newTool.assignedDate || ""}
                  onChange={(e) => setNewTool({ ...newTool, assignedDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tool-return">Expected Return Date (Optional)</Label>
                <Input
                  id="tool-return"
                  type="date"
                  value={newTool.returnDate || ""}
                  onChange={(e) => setNewTool({ ...newTool, returnDate: e.target.value })}
                  min={newTool.assignedDate || ""}
                />
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

      <Card>
        <CardHeader>
          <CardTitle>Tools List</CardTitle>
          <CardDescription>Manage tools for this project with QR code tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Return Date</TableHead>
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
                    <p className="text-muted-foreground mt-2">Loading tools...</p>
                  </TableCell>
                </TableRow>
              ) : tools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                    No tools assigned yet
                  </TableCell>
                </TableRow>
              ) : (
                tools.map((tool) => (
                  <TableRow key={tool.serialNumber}>
                    <TableCell>{tool.name}</TableCell>
                    <TableCell>{tool.serialNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100/80">
                        Assigned
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(tool.assignedDate)}</TableCell>
                    <TableCell>{formatDate(tool.returnDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleShowQRCode(tool)}>
                          <QrCode className="h-4 w-4" />
                          <span className="sr-only">Show QR Code</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleReturnTool(tool)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Return</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for {selectedTool?.name}</DialogTitle>
            <DialogDescription>Scan this QR code to track this tool</DialogDescription>
          </DialogHeader>
          <QRCodeGenerator serialNumber={selectedTool?.serialNumber || ""} toolName={selectedTool?.name || ""} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

