import { ProjectForm } from "@/components/project-form"

export default function NewProjectPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Project</h1>
      <ProjectForm />
    </div>
  )
}

