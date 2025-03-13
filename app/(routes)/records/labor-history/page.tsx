"use client";

import { useEffect, useState } from "react";
import { LaborHistory, columns } from "./columns";
import { DataTable } from "./LaborHistoryForms";
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

export default function LaborHistoryPage() {
  const [data, setData] = useState<LaborHistory[]>([]);

  // Fetch labor history records on mount
  useEffect(() => {
    async function fetchLaborHistory() {
      const { data, error } = await supabase.from("labor_history").select("*");
      if (data) {
        setData(
          data.map((item) => ({
            id: item.id,
            labor: item.labor,
            cost: item.cost, // Changed from quantity
            date: item.date, // Changed from category
          }))
        );
      } else {
        console.error("Error fetching labor history records", error);
      }
    }

    fetchLaborHistory();
  }, []);

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
                <BreadcrumbPage>Labor History</BreadcrumbPage>
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
  );
}
