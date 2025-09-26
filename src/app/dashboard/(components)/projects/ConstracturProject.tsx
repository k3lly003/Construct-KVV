"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContractorProjects() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Contractor Projects</CardTitle>
        <CardDescription>Manage and track your contractor engagements.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No projects to display yet.</p>
      </CardContent>
    </Card>
  );
}



