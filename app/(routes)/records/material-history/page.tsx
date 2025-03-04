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

async function getData(): Promise<Material[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Material A",
      cost: 100,
      date: "2023-01-01",
    },
    {
      id: "b1a2c3d4",
      name: "Material B",
      cost: 200,
      date: "2023-02-01",
    },
    {
      id: "c3d4e5f6",
      name: "Material C",
      cost: 150,
      date: "2023-03-01",
    },
    {
      id: "d4e5f6g7",
      name: "Material D",
      cost: 250,
      date: "2023-04-01",
    },
    {
      id: "e5f6g7h8",
      name: "Material E",
      cost: 300,
      date: "2023-05-01",
    },
    {
      id: "f6g7h8i9",
      name: "Material F",
      cost: 350,
      date: "2023-06-01",
    },
    {
      id: "g7h8i9j0",
      name: "Material G",
      cost: 400,
      date: "2023-07-01",
    },
    {
      id: "h8i9j0k1",
      name: "Material H",
      cost: 450,
      date: "2023-08-01",
    },
    {
      id: "i9j0k1l2",
      name: "Material I",
      cost: 500,
      date: "2023-09-01",
    },
    {
      id: "j0k1l2m3",
      name: "Material J",
      cost: 550,
      date: "2023-10-01",
    },
    {
      id: "k1l2m3n4",
      name: "Material K",
      cost: 600,
      date: "2023-11-01",
    },
    {
      id: "l2m3n4o5",
      name: "Material L",
      cost: 650,
      date: "2023-12-01",
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

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
