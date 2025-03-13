"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/utils/supabase/client"

const projectTypes = [
  "Two-storey Residence",
  "Two-Storey Apartment with Roofdeck",
  "Two-storey Residential with Roofdeck",
  "Three-Storey with Eight Bedrooms Residence",
  "Bungalow",
]

type ProjectFormProps = {
  project?: {
    id: string
    name: string
    type: string
    client: string
    dateRequested: string
    targetDate: string
    status: string
  }
  isEditing?: boolean
}

export function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const router = useRouter()
  const [name, setName] = useState(project?.name || "")
  const [type, setType] = useState(project?.type || "")
  const [client, setClient] = useState(project?.client || "")
  const [dateRequested, setDateRequested] = useState<Date | undefined>(
    project?.dateRequested ? new Date(project.dateRequested) : undefined,
  )
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    project?.targetDate ? new Date(project.targetDate) : undefined,
  )
  const [status, setStatus] = useState(project?.status || "Planning")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!name || !type || !client || !dateRequested || !targetDate) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Format dates for Supabase
      const formattedDateRequested = dateRequested.toISOString().split("T")[0]
      const formattedTargetDate = targetDate.toISOString().split("T")[0]

      if (isEditing && project?.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update({
            name,
            type,
            client,
            date_requested: formattedDateRequested,
            target_date: formattedTargetDate,
            status,
          })
          .eq("id", project.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        // Create new project
        const { error } = await supabase.from("projects").insert({
          name,
          type,
          client,
          date_requested: formattedDateRequested,
          target_date: formattedTargetDate,
          status: "Planning", // Default status for new projects
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }

      // Redirect after successful submission
      router.push("/")
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Project" : "Create New Project"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of your existing project"
              : "Fill in the details to create a new construction project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Project Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dateRequested">Date Requested</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRequested"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRequested && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRequested ? format(dateRequested, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateRequested} onSelect={setDateRequested} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="targetDate"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !targetDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {targetDate ? format(targetDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={targetDate}
                    onSelect={setTargetDate}
                    initialFocus
                    disabled={(date) => (dateRequested ? date < dateRequested : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Project" : "Create Project"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

