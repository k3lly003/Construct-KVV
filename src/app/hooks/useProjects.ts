import { useCallback } from "react";
import {
  projectService,
  ProjectUpdateData,
} from "@/app/services/projectServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Project } from "@/types/project";

// Safe form context hook that doesn't throw if context is not available
export const useSafeFormContext = () => {
  try {
    return import("@/state/form-context").then((mod) => mod.useFormContext());
  } catch {
    // The error parameter is intentionally omitted to avoid ESLint unused variable error
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
  } = useQuery<Project[]>({
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
    onError: (error: Error) => {
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
    onError: (error: unknown) => {
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

  return {
    projects,
    isLoading:
      isLoading ||
      deleteProjectMutation.isPending ||
      updateProjectMutation.isPending,
    error,
    deleteProject,
    updateProject,
  };
};

export const useProject = (id: string) => {
  console.log("🏠 useProject hook initialized for ID:", id);

  const {
    data: project,
    isLoading,
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

  return {
    project,
    isLoading,
    refetch,
  };
};
