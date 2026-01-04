"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ArchitectureProject() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Architecture Projects</CardTitle>
        <CardDescription>Manage and track your architecture engagements.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-small text-muted-foreground">No projects to display yet.</p>
      </CardContent>
    </Card>
  );
}



