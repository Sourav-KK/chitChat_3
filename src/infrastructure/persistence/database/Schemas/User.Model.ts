import {
  E_UserFrriendRequestStatus,
  E_UserGender,
  E_UserOnlinStatus,
  I_UserSchema,
} from "domain/interfaces/Schemas/userSchema.int";
import mongoose, { Types, Schema } from "mongoose";

const UserSchema = new Schema<I_UserSchema>(
  {
    email: {
      type: String,
      required: [true, "A valid email should be provided"],
      unique: [true, "This email is already registered"],
      trim: true,
      lowerCase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email."],
    },

    userName: {
      type: String,
      required: [true, "Please provide your username"],
      trim: true,
      unique: [true, "This UserName is already in use."],
      maxlength: [12, "Username should contain 4-12 characters"],
      minlength: [4, "Username should contain 4-12 characters"],
    },

    firstName: {
      type: String,
      required: [true, "Please provide your First Name"],
      trim: true,
      maxlength: [12, "First Name should contain 4-12 characters"],
      minlength: [4, "First Name should contain 4-12 characters"],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [12, "Bio should contain 4-36 characters"],
      minlength: [4, "Bio should contain 4-36 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Please provide your Last Name"],
      trim: true,
      maxlength: [
        12,
        "Last Name should contain a minlengthimum of 4-12 characters",
      ],
      minlength: [
        4,
        "Last Name should contain a minlengthimum of 4-12 characters",
      ],
    },

    hashedPassword: {
      type: String,
      required: [true, "Please provide a Password"],
      trim: true,
      maxlength: [
        12,
        "Password should contain a minlengthimum of 4-12 characters",
      ],
      minlength: [
        4,
        "Password should contain a minlengthimum of 4-12 characters",
      ],
    },

    profilePic: {
      type: String,
      default: function (this: I_UserSchema) {
        return `https://avatar.iran.liara.run/username?username=[${this.firstName}+${this.lastName}]`;
      },
    },

    gender: {
      type: String,
      enum: Object.values(E_UserGender),
      default: E_UserGender.Not_Specified,
      trim: true,
    },

    friends: [
      {
        userId: {
          type: Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: Object.values(E_UserFrriendRequestStatus),
          default: E_UserFrriendRequestStatus.pending,
        },
      },
    ],

    blockedUsers: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    lastSeen: {
      type: Date,
    },

    status: {
      type: String,
      enum: Object.values(E_UserOnlinStatus),
      default: E_UserOnlinStatus.offline,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<I_UserSchema>("User", UserSchema);

export type T_UserModel = typeof UserModel;
