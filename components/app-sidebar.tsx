"use client"

import * as React from "react"
import {
  NotebookPen,PresentationIcon, BookOpen, Bot, Command, Frame, Container, Map, PieChart,ViewIcon, Settings2,
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

// ✅ Define `data` before using it in `useState`
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
      name: "SDG Platform",
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
        { title: "Material Record", url: "/records/materials" },
        { title: "Material History", url: "/records/material-history" },
        { title: "Labor Record", url: "/records/labor-record" },
        { title: "Labor History", url: "/records/labor-history" }, 
        { title: "Category", url: "/records/material-category" },
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
      title: "Tracking",
      url: "#",
      icon: Settings2,
      items: [
        { title: "Equipment Tracking", url: "#" },
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
      title: "Reports",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Cost Forecast Reports", url: "#" },
        { title: "Project Planning Reports", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Project Viewing",
      url: "#",
      icon: ViewIcon,
    },
    {
      name: "Project Meeting",
      url: "#",
      icon: PresentationIcon,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // ✅ `data` is now defined before using `useState`
  const [selectedTeam, setSelectedTeam] = React.useState(data.teams[0].name)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} onTeamChange={(team) => setSelectedTeam(team.name)} />
      </SidebarHeader>
      <SidebarContent>
        {selectedTeam === "SDG Resources" ? (
          <NavResources items={data.navResources} />
        ) : (
          <NavMain items={data.navMain} />
        )}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
