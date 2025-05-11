import { Schema } from "mongoose";

interface I_Participant {
  userId: string;
  isAdmin: boolean;
}

export interface I_ChatRoomSchema extends Document {
  _id: string;
  type: "private" | "group";
  roomName: string;
  participants: I_Participant[];
  bio: string;
  createdBy: Schema.Types.ObjectId;
  roomIcon: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
