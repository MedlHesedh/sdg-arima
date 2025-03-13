import { Suspense } from "react"
import { ProjectForm } from "@/components/project-form"
import { createServerSupabaseClient } from "@/utils/supabase/server"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Edit Project</h1>
      <Suspense fallback={<FormSkeleton />}>
        <ProjectFormWrapper id={params.id} />
      </Suspense>
    </div>
  )
}

async function ProjectFormWrapper({ id }: { id: string }) {
  const supabase = createServerSupabaseClient()

  // Fetch project data from Supabase
  const { data: project, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error || !project) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
        <p className="text-muted-foreground">The project you're trying to edit doesn't exist or has been removed.</p>
      </div>
    )
  }

  // Transform the data to match the expected format in ProjectForm
  const formattedProject = {
    id: project.id,
    name: project.name,
    type: project.type,
    client: project.client,
    dateRequested: project.date_requested,
    targetDate: project.target_date,
    status: project.status,
  }

  return <ProjectForm project={formattedProject} isEditing={true} />
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

