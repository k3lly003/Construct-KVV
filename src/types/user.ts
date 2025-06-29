export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string | null;
  phone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Add any other fields as needed
}
