"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/userStore";
import TechnicianProjects from "../(components)/projects/TechnicianProjects";
import ArchitectureProject from "../(components)/projects/ArchitectureProject";
import ContractorProjects from "../(components)/projects/ConstracturProject";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { role, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "TECHNICIAN" && <TechnicianProjects />}
      {role === "ARCHITECT" && <ArchitectureProject />}
      {role === "CONTRACTOR" && <ContractorProjects />}
      {!role && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>View and manage your assigned projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No projects to display yet.</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
export default page;