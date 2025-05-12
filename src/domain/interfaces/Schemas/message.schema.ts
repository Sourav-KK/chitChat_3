import { Schema } from "mongoose";

export interface I_MessageSchema extends Document {
  _id: Schema.Types.ObjectId;
  roomId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  text: string;
  isRead: boolean;
  readBy: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
