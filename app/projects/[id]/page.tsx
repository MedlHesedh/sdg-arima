import Link from "next/link"
import { Calendar, Clock, Edit, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MaterialLaborTable } from "@/components/material-labor-table"
import { ToolsAssignmentTable } from "@/components/tools-assignment-table"

// Sample project data - in a real app, you would fetch this from an API
const projectsData = [
  {
    id: "1",
    name: "Greenview Residence",
    type: "Two-storey Residence",
    client: "John Smith",
    dateRequested: "2025-02-15",
    targetDate: "2025-08-20",
    status: "In Progress",
    description:
      "A modern two-storey residence with 4 bedrooms, 3 bathrooms, and a spacious living area. The project includes landscaping and a two-car garage.",
  },
  {
    id: "2",
    name: "Skyline Apartments",
    type: "Two-Storey Apartment with Roofdeck",
    client: "Sarah Johnson",
    dateRequested: "2025-01-10",
    targetDate: "2025-07-15",
    status: "Planning",
    description:
      "A multi-unit apartment complex with 8 units, each featuring 2 bedrooms and 1 bathroom. The building includes a shared roofdeck with panoramic views.",
  },
]

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data from an API
  const project = projectsData.find((p) => p.id === params.id)

  if (!project) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Project Not Found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

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
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.type}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
          <Button asChild variant="outline" size="sm">
            <Link href={`/projects/${project.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Client</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{project.client}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Requested</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(project.dateRequested)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(project.targetDate)}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
          <CardDescription>Overview of the construction project</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{project.description}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="materials-labor">
        <TabsList className="mb-6">
          <TabsTrigger value="materials-labor">Materials & Labor</TabsTrigger>
          <TabsTrigger value="tools">Tools Assignment</TabsTrigger>
        </TabsList>
        <TabsContent value="materials-labor">
          <MaterialLaborTable projectId={project.id} />
        </TabsContent>
        <TabsContent value="tools">
          <ToolsAssignmentTable projectId={project.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

