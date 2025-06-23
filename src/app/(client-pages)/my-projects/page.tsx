"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectService, Project } from '@/app/services/projectService';
import Link from 'next/link';
import { BrickLoader } from '@/components/ui/BrickLoader';
import { format } from 'date-fns';
import DefaultPageBanner from '@/components/ui/DefaultPageBanner';

const fetchUserProjects = async () => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('You must be logged in to view projects.');
  }
  return projectService.getMyProjects(authToken);
};

const getStatusClass = (status: Project['status']) => {
  switch (status) {
    case 'OPEN':
      return 'bg-green-100 text-green-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'COMPLETED':
      return 'bg-purple-100 text-purple-800';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-800';
    case 'DRAFT':
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
};

const ProjectCard = ({ project }: { project: Project }) => {  
  if (!project) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 h-full flex items-center justify-center">
        <div className="text-gray-500 text-center">
          Project data not available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg w-100 ml-10 shadow-sm hover:shadow-xl border border-gray-200 transition-shadow duration-300 flex flex-col justify-center h-full">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-600">
            Project ID
          </h3>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(project.status)}`}>
            {project.status}
          </span>
        </div>
        <p className="text-sm text-gray-800 break-all mb-4 truncate" title={project.id}>{project.id}</p>
        
        <div className="text-sm text-gray-500">
          <p className="font-semibold">Estimation ID:</p>
          <p className="break-all truncate" title={project.choosenEstimationId}>{project.choosenEstimationId}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Created:</span>
          <span>{project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'N/A'}</span>
        </div>
        <Link href={`/my-projects/${project.id}/bids`}>
          <div className="inline-block text-center w-full px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors">
            View Bids
          </div>
        </Link>
      </div>
    </div>
  );
};


export default function MyProjectsPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: projects, isLoading, error } = useQuery<Project[], Error>({
    queryKey: ['myProjects'],
    queryFn: fetchUserProjects,
    enabled: isClient,
  });

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BrickLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load projects</h2>
        <p className="text-gray-500">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <DefaultPageBanner title="My Projects" backgroundImage="/constructor.avif" />
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Here is a list of all your ongoing and completed projects. Select a project to view the bids it has received.
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) =>
              project ? (
                <ProjectCard key={project.id || index} project={project} />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
          </div>
        )}
      </div>
    </>
  );
}