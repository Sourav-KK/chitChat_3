import { Document, ObjectId } from "mongoose";

export interface I_AuthRepo {
  createUser(userData: Partial<Document>): Promise<Document>;

  checkEmailExists(email: string): Promise<boolean>;

  checkUserNameExists(userName: string): Promise<boolean>;

  updateProfilePic(userId: ObjectId, newUrl: string): Promise<Document>;

  getUserById(userId: ObjectId): Promise<Document | null>;

  updatePassword(userId: ObjectId, newHashedPassword: string): Promise<boolean>;

  getUserByEmail(email: string): Promise<Document | null>;
}
