import { I_NewMessage } from "domain/entities/message.entity";
import { I_MessageRepo } from "domain/interfaces/repositories/IMessageRepository";
import { T_MessageModel } from "infrastructure/persistence/database/Schemas/Message.Model";
import { Document, ObjectId } from "mongoose";

export class MessageRepo implements I_MessageRepo {
  private readonly model: T_MessageModel;

  constructor(model: T_MessageModel) {
    this.model = model;
  }

  async saveMessage(
    data: I_NewMessage
  ): Promise<Document<unknown, any, any> | null> {
    try {
      const newMessage = await this.model.create({
        ...data,
        readBy: [],
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return newMessage;
    } catch (error: any) {
      console.error("Error caught in saveMessage.service", error);
      throw new Error(`Failed to save message: ${error.message}`);
    }
  }

  async getMessagesByRoomId(roomId: ObjectId): Promise<Document[]> {
    try {
      return await this.model.find({ roomId }).sort({ createdAt: 1 }).exec();
    } catch (error: any) {
      console.error("Error in getMessagesByRoomId:", error);
      throw new Error("Failed to fetch messages");
    }
  }

  async markMessageAsRead(
    messageId: ObjectId,
    userId: ObjectId
  ): Promise<boolean> {
    try {
      const result = await this.model.updateOne(
        { _id: messageId },
        {
          $set: { isRead: true },
          $addToSet: { readBy: userId },
          $currentDate: { updatedAt: true },
        }
      );

      return result.modifiedCount > 0;
    } catch (error: any) {
      console.error("Error in markMessageAsRead:", error);
      throw new Error("Failed to mark message as read");
    }
  }
}

export default MessageRepo;
