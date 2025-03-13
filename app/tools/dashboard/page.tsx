import { Suspense } from "react"
import { ToolUtilizationDashboard } from "@/components/tool-utilization-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function ToolDashboardPage() {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tool Utilization</h1>
        <p className="text-muted-foreground mt-1">Monitor tool usage, assignments, and maintenance metrics</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <ToolUtilizationDashboard />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  )
}

