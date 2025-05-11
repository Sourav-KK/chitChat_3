import { I_NewMessage } from "domain/entities/message.entity";
import { Document, ObjectId } from "mongoose";

export interface I_MessageRepo {
  saveMessage(data: I_NewMessage): Promise<Document<unknown, any, any> | null>;

  getMessagesByRoomId(roomId: ObjectId): Promise<Document[]>;

  markMessageAsRead(messageId: ObjectId, userId: ObjectId): Promise<boolean>;
}
