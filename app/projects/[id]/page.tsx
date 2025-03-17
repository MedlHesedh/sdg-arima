// ProjectDetailsPage.tsx (Server Component)
import Link from "next/link";
import { Suspense } from "react";
import { createServerSupabaseClient } from "@/utils/supabase/server";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDetailsClient from "./ProjectDetailsClient"; // client component

export default async function ProjectDetailsPage(props: {
  params: { id: string };
}) {
  const { id } = await Promise.resolve(props.params);
  const supabase = createServerSupabaseClient();
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <>
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Project Not Found
        </h1>
        <p className="mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="container py-10">
      <Suspense fallback={<ProjectDetailsSkeleton />}>
        {/* Pass project data to the interactive client component */}
        <ProjectDetailsClient project={project} />
      </Suspense>
    </div>
  );
}

function ProjectDetailsSkeleton() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card shadow-sm p-6">
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>

      <div className="rounded-lg border bg-card shadow-sm mb-8 p-6">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-60 mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>

      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-[400px] w-full" />
    </>
  );
}
