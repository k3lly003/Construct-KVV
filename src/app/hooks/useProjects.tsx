import { useCallback } from "react";
import { Project } from "@/types/project";
import {
  projectService,
  ProjectUpdateData,
} from "@/app/services/projectServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Safe form context hook that doesn't throw if context is not available
export const useSafeFormContext = () => {
  try {
    const { useFormContext } = require("@/state/form-context");
    return useFormContext();
  } catch (error) {
    console.log("📝 Form context not available, using default data");
    return {
      formData: {
        bedrooms: 3,
        bathrooms: 2,
        projectType: "residential",
        apiResponse: {
          description: "Default project description",
          estimatedCost: 25000000,
          features: [
            {
              name: "garage",
              count: 1,
            },
            {
              name: "garden",
              count: 1,
            },
          ],
        },
      },
    };
  }
};

export const useProjects = () => {
  const queryClient = useQueryClient();

  console.log("🏠 useProjects hook initialized");

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return projectService.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (error: any) => {
      console.error("❌ Delete project mutation error:", error);
      toast.error("Failed to delete project");
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({
      id,
      projectData,
    }: {
      id: string;
      projectData: ProjectUpdateData;
    }) => {
      return projectService.updateProject(id, projectData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: (error: any) => {
      console.error("❌ Update project mutation error:", error);
    },
  });

  const deleteProject = useCallback(
    async (id: string) => {
      return deleteProjectMutation.mutateAsync(id);
    },
    [deleteProjectMutation]
  );

  const updateProject = useCallback(
    async (id: string, projectData: ProjectUpdateData) => {
      return updateProjectMutation.mutateAsync({ id, projectData });
    },
    [updateProjectMutation]
  );

  console.log("📊 Projects data:", projects);
  console.log("🔄 Loading state:", isLoading);
  console.log("❌ Error state:", error);

  return {
    projects,
    isLoading:
      isLoading ||
      deleteProjectMutation.isPending ||
      updateProjectMutation.isPending,
    error: error || deleteProjectMutation.error || updateProjectMutation.error,
    deleteProject,
    updateProject,
  };
};

export const useProject = (id: string) => {
  console.log("🏠 useProject hook initialized for ID:", id);

  const {
    data: project,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log("📊 Project data:", project);
  console.log("🔄 Loading state:", isLoading);
  console.log("❌ Error state:", error);

  return {
    project,
    isLoading,
    error,
    refetch,
  };
};
