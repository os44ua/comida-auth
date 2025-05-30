// ROles como string 
export type Role = "ADMIN" | "USER";

export const Role = {
  ADMIN: "ADMIN" as const,
  USER: "USER" as const
};

/*
export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}*/

export interface IAuthService {
  signIn(email: string, password: string): Promise<any>;
  signUp(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: any) => void): () => void;
  getCurrentUser(): any | null;
  getUserRoles(user: any): Promise<Role[]>;
}