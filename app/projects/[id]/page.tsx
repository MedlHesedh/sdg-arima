import Link from "next/link"
import { Calendar, Clock, Edit, User } from "lucide-react"
import { Suspense } from "react"
import { createServerSupabaseClient } from "@/utils/supabase/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MaterialLaborTable } from "@/components/material-labor-table"
import { ToolsAssignmentTable } from "@/components/tools-assignment-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <Suspense fallback={<ProjectDetailsSkeleton />}>
        <ProjectDetails id={params.id} />
      </Suspense>
    </div>
  )
}

async function ProjectDetails({ id }: { id: string }) {
  const supabase = createServerSupabaseClient()

  // Fetch project data from Supabase
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    return (
      <>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Project Not Found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </>
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
    <>
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
            <span>{formatDate(project.date_requested)}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target Completion</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{formatDate(project.target_date)}</span>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
          <CardDescription>Overview of the construction project</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{project.description || "No description provided."}</p>
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
    </>
  )
}

function ProjectDetailsSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8">
        <div className="p-6">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-60 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>

      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-[400px] w-full" />
    </>
  )
}

