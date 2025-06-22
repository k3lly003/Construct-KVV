export interface Extra {
  name: string;
  detail: {
    count: number;
  };
}

export interface ChoosenEstimation {
  id: string;
  roomsCount: number;
  bathroomsCount: number;
  kitchensCount: number;
  conversationRoomsCount: number;
  extras: Extra[];
  description: string;
  estimatedCost: number;
  createdAt: string;
  ownerId: string;
}

export interface Owner {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profilePic: string | null;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  // Add bid structure when available
  id?: string;
  amount?: number;
  description?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  status: string;
  ownerId: string;
  choosenEstimationId: string;
  createdAt: string;
  choosenEstimation: ChoosenEstimation;
  owner: Owner;
  bids: Bid[];
}

export interface ProjectsResponse {
  data: Project[];
  message?: string;
  status?: string;
}

// Legacy interface for backward compatibility
export interface Projects {
  rooms: number;
  bathrooms: number;
  kitchens: number;
  conversationRooms: number;
  extras: string;
  description: string;
  estimatedCost: number;
}
