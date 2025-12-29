"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TechnicianProjects() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Technician Projects</CardTitle>
        <CardDescription>View and manage your assigned technical projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-small text-muted-foreground">No projects to display yet.</p>
      </CardContent>
    </Card>
  );
}



