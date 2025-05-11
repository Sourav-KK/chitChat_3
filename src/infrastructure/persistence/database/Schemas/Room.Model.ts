// src/models/chat-room.model.ts
import { I_ChatRoomSchema } from "domain/interfaces/Schemas/room.schema";
import mongoose, { Schema } from "mongoose";

const ChatRoomSchema = new Schema<I_ChatRoomSchema>(
  {
        type: {
          type: String,
          enum: ["private", "group"],
          required: true,
        },

    roomName: {
      type: String,
      required: function () {
        return this.type === "group";
      },
    },

    bio: {
      type: String,
      default: "New group",
    },

    roomIcon: {
      type: String,
      default: function (this: I_ChatRoomSchema) {
        return `https://avatar.iran.liara.run/username?username=[${this.roomIcon}]`;
      },
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        isAdmin: Boolean,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ChatRoomSchema.index({ participants: 1 });
ChatRoomSchema.index({ type: 1, name: 1 });

export const ChatRoomModel = mongoose.model<I_ChatRoomSchema>(
  "ChatRoom",
  ChatRoomSchema
);

export type I_ChatRoomDocument = I_ChatRoomSchema & Document;

export type T_ChatRoomModel = typeof ChatRoomModel;
