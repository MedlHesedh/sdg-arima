import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import Image from "next/image"
import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProjectDashboard } from "@/components/project-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Listing from "@/components/listing"
import FilterSection from "@/components/filter-section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; import { Separator } from "@/components/ui/separator"; import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";

// Sample completed projects data - in a real app, you would fetch this from your API
const completedProjects = [
  {
    id: "5",
    title: "Highland Residence",
    type: "Two-storey Residential with Roofdeck",
    location: "789 Mountain View, Denver, CO",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Highland+Residence",
  },
  {
    id: "6",
    title: "Riverside Apartments",
    type: "Multi-unit Residential",
    location: "456 River Road, Portland, OR",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Riverside+Apartments",
  },
  {
    id: "7",
    title: "Oakwood Office Complex",
    type: "Commercial",
    location: "123 Business Park, Seattle, WA",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Oakwood+Office",
  },
]

export default function Home() {
  return (
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/records">Resources</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Materials</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
    {/* <div className="container py-10"> */}
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="projects">Project Planning</TabsTrigger>
          <TabsTrigger value="properties">SDG Development Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Project Planning</h1>
              <p className="text-muted-foreground mt-1">
                Manage your construction projects, materials, and labor assignments
              </p>
            </div>
            <Button asChild>
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          <Suspense fallback={<DashboardSkeleton />}>
            <ProjectDashboard />
          </Suspense>
        </TabsContent>

        <TabsContent value="properties">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">SDG Development Projects</h1>
            <Link href="/add-new-listing">
              <Button className="bg-primary hover:bg-primary/90">Add New Project</Button>
            </Link>
          </div>
          <FilterSection />
          <div className="mt-8">
            <Listing />
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Completed Projects</h1>
              <p className="text-muted-foreground mt-1">
                Browse our portfolio of successfully completed SDG Development projects
              </p>
            </div>
            <Button asChild>
              <Link href="/completed-projects">View All Completed Projects</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show just a preview of 3 completed projects */}
            {completedProjects.slice(0, 3).map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-100 text-green-800">Completed</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{project.type}</p>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <p className="text-sm truncate">{project.location}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href={`/view-project/${project.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    {/* </div> */}
    </SidebarInset>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            <div className="p-6 pt-0 flex justify-end">
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        ))}
    </div>
  )
}

