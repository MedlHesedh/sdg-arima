"use client"

import * as React from "react"
import {
  NotebookPen, BookOpen, Bot, Command, Frame, Container, Map, PieChart, Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavResources } from "@/components/nav-resources"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Medl Masangcap",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SDG Resources",
      logo: Container,
      plan: "Enterprise",
    },
    {
      name: "SDG Planning",
      logo: NotebookPen,
      plan: "Startup",
    },
    {
      name: "SDG Forecasting",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
     
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  navResources: [
    {
      title: "Resources",
      url: "/records",
      icon: Frame,
      items: [
        { title: "Materials", url: "/records/materials" },
        { title: "Materials Category", url: "/records/material-category" },
        { title: "Material History", url: "/records/material-history" },
        { title: "Data Table", url: "/records/data-table" },
        { title: "Labor Record", url: "/records/labor-record" },
        { title: "Labor History", url: "/records/labor-history" },
      ],
    },
    {
      title: "Forecasting",
      url: "#",
      icon: PieChart,
      items: [
        { title: "Material Cost Forecast", url: "#" },
        { title: "Labor Cost Forecast", url: "#" },
      ],
    },
    {
      title: "Project Planning",
      url: "#",
      icon: Map,
      items: [
        { title: "Project Dashboard", url: "#" },
        { title: "Create Project Plan", url: "#" },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Cost Forecast Reports", url: "#" },
        { title: "Project Planning Reports", url: "#" },
      ],
    },
    {
      title: "Tracking",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Equipment Tracking", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavResources items={data.navResources} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
