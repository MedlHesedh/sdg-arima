"use client";

import { Material, columns } from "./columns"
import { DataTable } from "./MaterialHistory"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { supabase } from "@/utils/supabase/client";

async function getData(): Promise<Material[]> {
  const { data, error } = await supabase.from("material_history").select("*")
  if (error) {
    console.error("Error fetching data", error)
    return []
  }
  return data.map((item) => ({
    id: item.id,
    name: item.material,
    cost: item.cost ?? 0, // Ensure cost is always a number
    date: item.date ?? "N/A", // Default if date is missing
  }))
}

export default function DemoPage() {
  const [data, setData] = useState<Material[]>([])

  useEffect(() => {
    async function fetchMaterials() {
      const materials = await getData()
      setData(materials)
    }

    fetchMaterials()

    // Setup Real-Time Subscription
    const channel = supabase
      .channel("material_adding")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "material_adding" },
        (payload) => {
          const newMaterial: Material = {
            id: payload.new.id,
            name: payload.new.material,
            cost: payload.new.cost ?? 0,
            date: payload.new.date ?? "N/A",
          }
          handleMaterialAdded(newMaterial)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel) // Properly clean up subscription
    }
  }, [])

  function handleMaterialAdded(newMaterial: Material) {
    setData((prevData) => [newMaterial, ...prevData])
  }

  return (
    <SidebarInset>
      {/* Page Header */}
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
                <BreadcrumbPage>Material History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarInset>
  )
}
