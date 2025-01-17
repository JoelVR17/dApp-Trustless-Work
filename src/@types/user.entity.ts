export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  identification?: string;
  phone?: string;
  country?: string;
  saveEscrow?: boolean;
}

export type UserPayload = Omit<User, "createdAt" | "updatedAt" | "id">;
