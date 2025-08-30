"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const page = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Projects</CardTitle>
        <CardDescription>View and manage your assigned projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No projects to display yet.</p>
      </CardContent>
    </Card>
  );
}
export default page;