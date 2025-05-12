import { ObjectId } from "mongoose";

export interface I_CreateRoom {
  readonly participants: ObjectId[];
  readonly type: string;
  readonly roomName: string;
  readonly roomIcon: string;
  readonly bio: string;
}
