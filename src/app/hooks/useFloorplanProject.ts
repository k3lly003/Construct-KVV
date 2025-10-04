import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  floorplanProjectService, 
  FloorplanProjectRequest, 
  FloorplanProjectResponse,
  ProjectListItem,
  ProjectDetails 
} from '@/app/services/floorplanProjectService';

export const useFloorplanProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createProject = useCallback(async (data: FloorplanProjectRequest): Promise<FloorplanProjectResponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await floorplanProjectService.createProject(data);
      toast.success('Project created successfully! 🎉');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllProjects = useCallback(async (): Promise<ProjectListItem[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await floorplanProjectService.getAllProjects();
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch projects';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectById = useCallback(async (id: string): Promise<ProjectDetails> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await floorplanProjectService.getProjectById(id);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch project details';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectStatus = useCallback(async (id: string, status: "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED"): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await floorplanProjectService.updateProjectStatus(id, status);
      toast.success(`Project status updated to ${status} successfully!`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update project status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<ProjectDetails>): Promise<ProjectDetails> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await floorplanProjectService.updateProject(id, data);
      toast.success('Project updated successfully!');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await floorplanProjectService.deleteProject(id);
      toast.success('Project deleted successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectStatus,
    updateProject,
    deleteProject
  };
};
