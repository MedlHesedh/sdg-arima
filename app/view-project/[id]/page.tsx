"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin, ArrowLeft, Users, FileText, Building, Briefcase } from "lucide-react"

interface Project {
  id: string
  title: string
  budget: number
  location: string
  description: string
  type: string
  status: string
  startDate: string
  endDate: string
  features: string[]
  images: string[]
  client: {
    name: string
    phone: string
    email: string
    photo: string
  }
}

export default function ViewProject() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    // In a real app, you would fetch the project data from your API
    // For this example, we'll use mock data
    const mockProject: Project = {
      id: id as string,
      title: "Greenview Residence",
      budget: 250000,
      location: "123 Main St, New York, NY 10001",
      description:
        "A modern two-storey residence with 4 bedrooms, 3 bathrooms, and a spacious living area. The project includes landscaping and a two-car garage.",
      type: "Residential",
      status: "In Progress",
      startDate: "2025-02-15",
      endDate: "2025-08-20",
      features: [
        "4 Bedrooms",
        "3 Bathrooms",
        "Two-car Garage",
        "Open Floor Plan",
        "Energy Efficient Design",
        "Smart Home Technology",
        "Landscaped Garden",
        "Outdoor Patio",
      ],
      images: [
        "/placeholder.svg?height=600&width=800&text=Front View",
        "/placeholder.svg?height=600&width=800&text=Living Room",
        "/placeholder.svg?height=600&width=800&text=Kitchen",
        "/placeholder.svg?height=600&width=800&text=Bedroom",
        "/placeholder.svg?height=600&width=800&text=Bathroom",
      ],
      client: {
        name: "John Smith",
        phone: "(555) 123-4567",
        email: "john.smith@example.com",
        photo: "/placeholder.svg?height=200&width=200&text=Client",
      },
    }

    setProject(mockProject)
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading project details...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Link href="/">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{project.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
              <Image
                src={project.images[activeImage] || "/placeholder.svg"}
                alt={`Project image ${activeImage + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-video rounded-md overflow-hidden cursor-pointer ${
                    index === activeImage ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Project thumbnail ${index + 1}`}
                    width={160}
                    height={90}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>

            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{project.location}</span>
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">{project.type}</p>
                  <p className="text-sm text-muted-foreground">Type</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">{new Date(project.endDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Target Date</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div>
          {/* Budget Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-primary">₱{project.budget.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>

              <div className="space-y-3">
                <Link href={`/projects/${project.id}`}>
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    View Project Plan
                  </Button>
                </Link>

                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Client Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
                  <Image
                    src={project.client.photo || "/placeholder.svg"}
                    alt={project.client.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{project.client.name}</h3>
                  <p className="text-sm text-muted-foreground">Client</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  {project.client.phone}
                </p>
                <p className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  {project.client.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

