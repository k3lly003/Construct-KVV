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
  id: string;
  message: string;
  amount: number;
  createdAt: string;
  sellerId?: string;
  description?: string;
  // Add any other fields as needed
}

// Define the project status types
export type ProjectStatus = "DRAFT" | "OPEN" | "CLOSED" | "COMPLETED";

export interface Project {
  id: string;
  status: ProjectStatus;
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

export enum BidStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
  COUNTERED = "COUNTERED",
}
