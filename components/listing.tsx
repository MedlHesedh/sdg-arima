"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, MapPin, Heart, Clock } from "lucide-react"

interface Project {
  id: string
  title: string
  budget: number
  location: string
  type: string
  status: string
  startDate: string
  endDate: string
  imageUrl: string
}

export default function Listing() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "Greenview Residence",
      budget: 250000,
      location: "123 Main St, New York, NY",
      type: "Residential",
      status: "In Progress",
      startDate: "2025-02-15",
      endDate: "2025-08-20",
      imageUrl: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "2",
      title: "Skyline Apartments",
      budget: 500000,
      location: "456 Ocean Ave, Miami, FL",
      type: "Residential",
      status: "Planning",
      startDate: "2025-01-10",
      endDate: "2025-07-15",
      imageUrl: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "3",
      title: "Oceanview Manor",
      budget: 750000,
      location: "789 Park Blvd, San Francisco, CA",
      type: "Residential",
      status: "Planning",
      startDate: "2025-03-05",
      endDate: "2025-12-10",
      imageUrl: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "4",
      title: "Sunset Bungalow",
      budget: 180000,
      location: "101 Suburban Dr, Austin, TX",
      type: "Residential",
      status: "In Progress",
      startDate: "2025-02-28",
      endDate: "2025-06-30",
      imageUrl: "/placeholder.svg?height=300&width=500",
    },
  ])

  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planning":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-amber-100 text-amber-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} className="overflow-hidden">
          <div className="relative">
            <Image
              src={project.imageUrl || "/placeholder.svg"}
              alt={project.title}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 rounded-full"
              onClick={() => toggleFavorite(project.id)}
            >
              <Heart
                className={`h-5 w-5 ${favorites.includes(project.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`}
              />
            </Button>
            <div
              className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
            >
              {project.status}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-primary text-xl font-bold">₱{project.budget.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <p className="text-sm truncate">{project.location}</p>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(project.startDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatDate(project.endDate)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link href={`/view-project/${project.id}`}>
              <Button variant="outline">View Details</Button>
            </Link>
            <Link href={`/projects/${project.id}`}>
              <Button variant="secondary">Project Plan</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

