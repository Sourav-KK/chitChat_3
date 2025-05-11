import { ObjectId } from "mongoose";

export interface I_NewMessage {
  readonly roomId: ObjectId;
  readonly senderId: ObjectId;
  readonly receiverId: ObjectId;
  readonly text: String;
}
