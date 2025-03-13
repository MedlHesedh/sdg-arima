import { Suspense } from "react"
import { ToolsRecordTable } from "@/components/tools-record-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function ToolsInventoryPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tools Inventory</h1>
        <p className="text-muted-foreground mt-1">
          Manage your construction tools inventory, status, and maintenance records
        </p>
      </div>

      <Suspense fallback={<ToolsTableSkeleton />}>
        <ToolsRecordTable />
      </Suspense>
    </div>
  )
}

function ToolsTableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-full mb-6" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full mb-2" />
            ))}
        </div>
      </div>
    </div>
  )
}

