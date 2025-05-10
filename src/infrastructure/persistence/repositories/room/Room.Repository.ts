import { I_CreateRoom } from "domain/entities/room.entity";
import { I_RoomRepo } from "domain/interfaces/repositories/IRoomRepository";
import {
  I_ChatRoomDocument,
  T_ChatRoomModel,
} from "infrastructure/persistence/database/Schemas/Room.Model";

import { ObjectId } from "mongoose";

class RoomRepo implements I_RoomRepo {
  private readonly model: T_ChatRoomModel;

  constructor(model: T_ChatRoomModel) {
    this.model = model;
  }

  async createRoom(data: I_CreateRoom): Promise<I_ChatRoomDocument | null> {
    try {
      const newRoom = await this.model.create({
        ...data,
      });
      // await this.cacheRoom(newRoom);
      return newRoom;
    } catch (error: any) {
      console.error("Error caught in createRoom.service", error);
      throw new Error("Failed to create room");
    }
  }

  async updateRoomBio(
    userId: ObjectId,
    roomId: ObjectId,
    newBio: string
  ): Promise<I_ChatRoomDocument | null> {
    try {
      const updatedBio = await this.model.findOneAndUpdate(
        {
          _id: roomId,
          participants: {
            $elemMatch: { userId, isAdmin: true },
          },
        },
        {
          $set: { bio: newBio },
        },
        { new: true }
      );
      return updatedBio;
    } catch (error: any) {
      console.error("Error caught in updatedBio.service", error);
      throw new Error("Failed to update room bio");
    }
  }

  async addParticipant(
    roomId: ObjectId,
    userId: ObjectId,
    isAdmin = false
  ): Promise<I_ChatRoomDocument | null> {
    try {
      const updatedRoom = await this.model.findByIdAndUpdate(
        roomId,
        {
          $addToSet: {
            participants: { _id: userId, isAdmin },
          },
        },
        { new: true }
      );
      return updatedRoom;
    } catch (error) {
      console.error("Error in addParticipant:", error);
      throw new Error("Failed to add participant");
    }
  }

  async removeParticipant(
    roomId: ObjectId,
    userId: ObjectId
  ): Promise<I_ChatRoomDocument | null> {
    try {
      const updatedRoom = await this.model.findByIdAndUpdate(
        roomId,
        {
          $pull: {
            participants: { userId },
          },
        },
        { new: true }
      );
      return updatedRoom;
    } catch (error) {
      console.error("Error in removeParticipant:", error);
      throw new Error("Failed to remove participant");
    }
  }

  async deleteRoomById(roomId: ObjectId): Promise<boolean> {
    try {
      const result = await this.model.deleteOne({ _id: roomId });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error in deleteRoomById:", error);
      throw new Error("Failed to delete room");
    }
  }
}

export default RoomRepo;
