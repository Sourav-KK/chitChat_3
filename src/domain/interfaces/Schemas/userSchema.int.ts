import { Schema, Types } from "mongoose";

export enum E_UserGender {
  Male = "Male",
  Female = "Female",
  Not_Specified = "Not Specified",
}

export enum E_UserOnlinStatus {
  online = "online",
  offline = "offline",
}

export enum E_UserFrriendRequestStatus {
  pending = "pending",
  accepted = "accepted",
}

export interface I_UserSchema extends Document {
  _id: Schema.Types.ObjectId;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  profilePic: string;
  status: E_UserOnlinStatus;
  gender?: E_UserGender;
  lastSeen?: Date;
  blockedUsers?: Types.ObjectId[];
  friends?: Array<{ userId: string; status: E_UserFrriendRequestStatus }>;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
