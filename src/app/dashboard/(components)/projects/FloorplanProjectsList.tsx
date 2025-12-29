"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFloorplanProject } from '@/app/hooks/useFloorplanProject';
import { ProjectListItem } from '@/app/services/floorplanProjectService';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  FileText,
  Clock,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import CreateFloorplanProjectForm from './CreateFloorplanProjectForm';

interface FloorplanProjectsListProps {
  onCreateNew?: () => void;
}

export default function FloorplanProjectsList({ onCreateNew }: FloorplanProjectsListProps) {
  const { getAllProjects, deleteProject, updateProjectStatus, loading, error } = useFloorplanProject();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const projectList = await getAllProjects();
      setProjects(projectList);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteProject(id);
      await loadProjects(); // Reload the list
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED") => {
    try {
      await updateProjectStatus(id, newStatus);
      await loadProjects(); // Reload the list
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  const handleCreateSuccess = async (projectId: string) => {
    setShowCreateForm(false);
    await loadProjects(); // Reload the list
    toast.success('Project created successfully!', {
      description: `Project ID: ${projectId}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'CLOSED': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount?: number, currency = 'RWF') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (showCreateForm) {
    return (
      <CreateFloorplanProjectForm
        onSuccess={handleCreateSuccess}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title font-bold text-gray-900">Construction Projects</h1>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-title font-bold text-gray-900">Construction Projects</h1>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Building className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-mid font-semibold text-gray-900 mb-2">Error Loading Projects</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadProjects}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title font-bold text-gray-900">Construction Projects</h1>
          <p className="text-gray-600 mt-1">Manage your floorplan-based construction projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <Building className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-mid font-semibold text-gray-900 mb-2">No Projects Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first construction project by uploading a floorplan and letting our AI analyze it.
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      Project #{project.id.slice(-8)}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Project Summary */}
                {project.summary && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      AI Summary
                    </h4>
                    <p className="text-small text-gray-600 line-clamp-3">
                      {project.summary}
                    </p>
                  </div>
                )}

                {/* Cost Information */}
                {project.totalEstimatedCost && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Cost Estimate
                    </h4>
                    <p className="text-mid font-semibold text-green-600">
                      {formatCurrency(project.totalEstimatedCost, project.currency)}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  {/* Status Update Buttons */}
                  {project.status === 'DRAFT' && (
                    <Button 
                      onClick={() => handleStatusUpdate(project.id, 'OPEN')}
                      size="sm"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Clock className="h-4 w-4" />
                      Publish
                    </Button>
                  )}
                  
                  {project.status === 'OPEN' && (
                    <Button 
                      onClick={() => handleStatusUpdate(project.id, 'CLOSED')}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Close Bidding
                    </Button>
                  )}

                  <Button 
                    onClick={() => handleDeleteProject(project.id)}
                    variant="outline"
                    size="sm"
                    disabled={deletingId === project.id}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === project.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
