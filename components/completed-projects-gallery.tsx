"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Building, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// This would typically come from your database or API
// For now, we're using sample data that includes completed projects
const completedProjects = [
  {
    id: "5",
    title: "Highland Residence",
    budget: 320000,
    location: "789 Mountain View, Denver, CO",
    type: "Two-storey Residential with Roofdeck",
    status: "Completed",
    startDate: "2024-01-20",
    endDate: "2024-09-15",
    description:
      "A modern two-storey residence with a spacious roofdeck offering panoramic mountain views. Features 4 bedrooms, 3 bathrooms, and energy-efficient design.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Highland+Residence",
    client: "Robert Wilson",
  },
  {
    id: "6",
    title: "Riverside Apartments",
    budget: 650000,
    location: "456 River Road, Portland, OR",
    type: "Multi-unit Residential",
    status: "Completed",
    startDate: "2023-08-10",
    endDate: "2024-07-30",
    description:
      "A 12-unit apartment complex with modern amenities, including a shared courtyard, fitness center, and sustainable design features.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Riverside+Apartments",
    client: "Jennifer Adams",
  },
  {
    id: "7",
    title: "Oakwood Office Complex",
    budget: 850000,
    location: "123 Business Park, Seattle, WA",
    type: "Commercial",
    status: "Completed",
    startDate: "2023-05-15",
    endDate: "2024-06-20",
    description:
      "A three-story office complex with modern workspaces, conference rooms, and a green roof. Designed for optimal energy efficiency and employee comfort.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Oakwood+Office",
    client: "Oakwood Enterprises",
  },
  {
    id: "8",
    title: "Sunset Community Center",
    budget: 420000,
    location: "789 Community Drive, Phoenix, AZ",
    type: "Public",
    status: "Completed",
    startDate: "2023-09-05",
    endDate: "2024-05-15",
    description:
      "A community center featuring a multipurpose hall, classrooms, and outdoor recreational spaces. Designed to serve as a hub for local activities and events.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Community+Center",
    client: "Sunset District Council",
  },
  {
    id: "9",
    title: "Green Valley Eco-Homes",
    budget: 580000,
    location: "456 Sustainable Lane, Austin, TX",
    type: "Residential Development",
    status: "Completed",
    startDate: "2023-03-10",
    endDate: "2024-04-25",
    description:
      "A development of six eco-friendly homes featuring solar panels, rainwater harvesting systems, and sustainable building materials.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Eco+Homes",
    client: "Green Valley Developers",
  },
  {
    id: "10",
    title: "Lakeside Restaurant",
    budget: 390000,
    location: "123 Lake View, Chicago, IL",
    type: "Commercial",
    status: "Completed",
    startDate: "2023-07-15",
    endDate: "2024-02-28",
    description:
      "A waterfront restaurant with indoor and outdoor dining areas, featuring panoramic views of the lake and a modern, sustainable design.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Lakeside+Restaurant",
    client: "Lakeside Dining Group",
  },
]

export function CompletedProjectsGallery() {
  const [projects] = useState(completedProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  // Filter projects based on search term and type
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || project.type === filterType

    return matchesSearch && matchesType
  })

  const uniqueTypes = Array.from(new Set(projects.map((project) => project.type)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All project types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All project types</SelectItem>
            {uniqueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No completed projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48">
                <Image src={project.imageUrl || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100/80">
                  Completed
                </Badge>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                <p className="text-primary text-xl font-bold mb-2">₱{project.budget.toLocaleString()}</p>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <p className="text-sm truncate">{project.location}</p>
                </div>
                <div className="flex flex-wrap gap-4 mb-3 text-sm">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{project.type}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Completed: {formatDate(project.endDate)}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm line-clamp-2">{project.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/view-project/${project.id}`}>View Project Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

