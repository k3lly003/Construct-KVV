'use client';

import CreatePortfolioForm from "../(components)/portfolio/CreatePortfolioForm";
import TechnicianPortfolioList from "../(components)/portfolio/TechnicianPortfolioList";
import ContractorPortfolioList from "../(components)/portfolio/ContractorPortfolioList";
import ArchitectPortfolioList from "../(components)/portfolio/ArchitectPortfolioList";
import CreatePortfolioDialog from "../(components)/portfolio/CreatePortfolioDialog";
import CommonPortfolioList from "../(components)/portfolio/CommonPortfolioList";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortfolioPage() {
  const { role, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Recent Portfolio</h2>
          <p className="text-sm text-muted-foreground">Create and manage your recent work.</p>
        </div>
        <CreatePortfolioDialog onSuccess={() => { /* lists will refresh themselves on mount via effect; if needed we can lift state */ }} />
      </div>

      {role === 'TECHNICIAN' && <CommonPortfolioList professionalType="technician" title="Recent Portfolio" description="Your most recent public items." />}
      {role === 'CONTRACTOR' && <CommonPortfolioList professionalType="contractor" title="Recent Portfolio" description="Your most recent public items." />}
      {role === 'ARCHITECT' && <CommonPortfolioList professionalType="architect" title="Recent Portfolio" description="Your most recent public items." />}

      {!role && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Sign in to manage your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please log in.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


