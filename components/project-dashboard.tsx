"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample project data
const projectsData = [
  {
    id: "1",
    name: "Greenview Residence",
    type: "Two-storey Residence",
    client: "John Smith",
    dateRequested: "2025-02-15",
    targetDate: "2025-08-20",
    status: "In Progress",
  },
  {
    id: "2",
    name: "Skyline Apartments",
    type: "Two-Storey Apartment with Roofdeck",
    client: "Sarah Johnson",
    dateRequested: "2025-01-10",
    targetDate: "2025-07-15",
    status: "Planning",
  },
  {
    id: "3",
    name: "Oceanview Manor",
    type: "Three-Storey with Eight Bedrooms Residence",
    client: "Michael Brown",
    dateRequested: "2025-03-05",
    targetDate: "2025-12-10",
    status: "Planning",
  },
  {
    id: "4",
    name: "Sunset Bungalow",
    type: "Bungalow",
    client: "Emily Davis",
    dateRequested: "2025-02-28",
    targetDate: "2025-06-30",
    status: "In Progress",
  },
  {
    id: "5",
    name: "Highland Residence",
    type: "Two-storey Residential with Roofdeck",
    client: "Robert Wilson",
    dateRequested: "2025-01-20",
    targetDate: "2025-09-15",
    status: "Planning",
  },
]

export function ProjectDashboard() {
  const [projects, setProjects] = useState(projectsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || project.type === filterType

    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "In Progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Label htmlFor="filter" className="sr-only">
            Filter by type
          </Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger id="filter">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Two-storey Residence">Two-storey Residence</SelectItem>
              <SelectItem value="Two-Storey Apartment with Roofdeck">Two-Storey Apartment with Roofdeck</SelectItem>
              <SelectItem value="Two-storey Residential with Roofdeck">Two-storey Residential with Roofdeck</SelectItem>
              <SelectItem value="Three-Storey with Eight Bedrooms Residence">
                Three-Storey with Eight Bedrooms Residence
              </SelectItem>
              <SelectItem value="Bungalow">Bungalow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/completed-projects">View Completed Projects</Link>
        </Button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No projects found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">{project.type}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{project.client}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Requested: {formatDate(project.dateRequested)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Target: {formatDate(project.targetDate)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/projects/${project.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

