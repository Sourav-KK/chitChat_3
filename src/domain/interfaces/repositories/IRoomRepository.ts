import { ObjectId, Document } from "mongoose";
import { I_ChatRoomDocument } from "infrastructure/persistence/database/Schemas/Room.Model";
import { I_CreateRoom } from "domain/entities/room.entity";

export interface I_RoomRepo {
  createRoom(data: I_CreateRoom): Promise<I_ChatRoomDocument | null>;

  updateRoomBio(
    userId: ObjectId,
    roomId: ObjectId,
    newBio: string
  ): Promise<I_ChatRoomDocument | null>;

  addParticipant(
    roomId: ObjectId,
    userId: ObjectId,
    isAdmin: boolean
  ): Promise<I_ChatRoomDocument | null>;

  removeParticipant(
    roomId: ObjectId,
    userId: ObjectId
  ): Promise<I_ChatRoomDocument | null>;

  deleteRoomById(roomId: ObjectId): Promise<boolean>;
}
