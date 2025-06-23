import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Define a basic Project type. You may need to expand this based on your actual data.
export interface Project {
  id: string;
  status: 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';
  ownerId: string;
  choosenEstimationId: string;
  createdAt: string;
}

export const projectService = {
  async getMyProjects(authToken: string): Promise<Project[]> {
    const response = await axios.get(`${API_URL}/api/v1/final-project`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data.data || response.data;
  },
}; 