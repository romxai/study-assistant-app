import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  email: string;
  password: string; // This will be hashed
  createdAt: Date;
  updatedAt: Date;
}

// Safe user type without sensitive information
export type SafeUser = Omit<User, "password"> & {
  _id: string; // Convert ObjectId to string for client-side
};

export interface UserSession {
  _id: ObjectId;
  userId: ObjectId;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}
