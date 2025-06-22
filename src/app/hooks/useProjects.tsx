import { useCallback } from "react";
import { Project } from "@/types/project";
import { projectService } from "@/app/services/projectServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

  const deleteProject = useCallback(
    async (id: string) => {
      return deleteProjectMutation.mutateAsync(id);
    },
    [deleteProjectMutation]
  );

  console.log("📊 Projects data:", projects);
  console.log("🔄 Loading state:", isLoading);
  console.log("❌ Error state:", error);

  return {
    projects,
    isLoading: isLoading || deleteProjectMutation.isPending,
    error: error || deleteProjectMutation.error,
    deleteProject,
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
