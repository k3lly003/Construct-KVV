"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SellerProjects() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Seller Projects</CardTitle>
        <CardDescription>Manage and track projects related to your shop.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">No projects to display yet.</p>
      </CardContent>
    </Card>
  );
}



