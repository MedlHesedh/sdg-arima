import { Material, columns } from "./columns"
import { DataTable } from "./MaterialsForm"
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
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 100,
    },
    {
      id: "b1a2c3d4",
      name: "Material B",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 200,
    },
    {
      id: "c3d4e5f6",
      name: "Material C",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 150,
    },
    {
      id: "d4e5f6g7",
      name: "Material D",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 250,
    },
    {
      id: "e5f6g7h8",
      name: "Material E",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 300,
    },
    {
      id: "f6g7h8i9",
      name: "Material F",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 350,
    },
    {
      id: "g7h8i9j0",
      name: "Material G",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 400,
    },
    {
      id: "h8i9j0k1",
      name: "Material H",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 450,
    },
    {
      id: "i9j0k1l2",
      name: "Material I",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 500,
    },
    {
      id: "j0k1l2m3",
      name: "Material J",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 550,
    },
    {
      id: "k1l2m3n4",
      name: "Material K",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 600,
    },
    {
      id: "l2m3n4o5",
      name: "Material L",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 650,
    },
    {
      id: "m3n4o5p6",
      name: "Material M",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 700,
    },
    {
      id: "n4o5p6q7",
      name: "Material N",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 750,
    },
    {
      id: "o5p6q7r8",
      name: "Material O",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 800,
    },
    {
      id: "p6q7r8s9",
      name: "Material P",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 850,
    },
    {
      id: "q7r8s9t0",
      name: "Material Q",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 900,
    },
    {
      id: "r8s9t0u1",
      name: "Material R",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 950,
    },
    {
      id: "s9t0u1v2",
      name: "Material S",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 1000,
    },
    {
      id: "t0u1v2w3",
      name: "Material T",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 1050,
    },
    {
      id: "u1v2w3x4",
      name: "Material U",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 1100,
    },
    {
      id: "v2w3x4y5",
      name: "Material V",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 1150,
    },
    {
      id: "w3x4y5z6",
      name: "Material W",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 1200,
    },
    {
      id: "x4y5z6a7",
      name: "Material X",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 1250,
    },
    {
      id: "y5z6a7b8",
      name: "Material Y",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 1300,
    },
    {
      id: "z6a7b8c9",
      name: "Material Z",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 1350,
    },
    {
      id: "a7b8c9d0",
      name: "Material AA",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 1400,
    },
    {
      id: "b8c9d0e1",
      name: "Material BB",
      unitOfMeasurement: "kg",
      category: "Category 3",
      quantity: 1450,
    },
    {
      id: "c9d0e1f2",
      name: "Material CC",
      unitOfMeasurement: "kg",
      category: "Category 2",
      quantity: 1500,
    },
    {
      id: "d0e1f2g3",
      name: "Material DD",
      unitOfMeasurement: "kg",
      category: "Category 1",
      quantity: 1550,
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
                <BreadcrumbPage>Add Materials</BreadcrumbPage>
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
