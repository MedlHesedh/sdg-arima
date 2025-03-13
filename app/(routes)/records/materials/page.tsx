"use client"; // Convert to client component

import { useEffect, useState } from "react";
import { Material, columns } from "./columns";
import { DataTable } from "./MaterialsForm";
// import MyForm from "./addMaterial"; // Import form component
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from "@/utils/supabase/client";

export default function DemoPage() {
  const [data, setData] = useState<Material[]>([]);

  // Fetch materials on mount
  useEffect(() => {
    async function fetchMaterials() {
      const { data, error } = await supabase.from("material_adding").select("*");
      if (data) {
        setData(
          data.map((item) => ({
            id: item.id,
            name: item.material,
            unitOfMeasurement: item.unit,
            category: item.category,
            quantity: item.quantity,
          }))
        );
      } else {
        console.error("Error fetching data", error);
      }
    }

    fetchMaterials();
  }, []);

  // Function to handle real-time material updates

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
                <BreadcrumbPage>Add Materials</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Page Content */}
      <div className="container mx-auto py-10">
        {/* <MyForm onMaterialAdded={handleMaterialAdded} /> Form for adding new materials */}
        <DataTable columns={columns} data={data} />
      </div>
    </SidebarInset>
  );
}
