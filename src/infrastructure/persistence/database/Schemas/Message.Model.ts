import { I_MessageSchema } from "domain/interfaces/Schemas/message.schema";
import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema<I_MessageSchema>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Cannot send an empty message"],
      maxlength: [500, "Exceeded message limit"],
      minlength: [1, "Cannot send an empty message"],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ roomId: 1, createdAt: -1 });
MessageSchema.index({ "readBy.user": 1 });

export const MessageModel = mongoose.model<I_MessageSchema>(
  "Message",
  MessageSchema
);

export type T_MessageModel = typeof MessageModel;
