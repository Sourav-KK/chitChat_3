import { I_AuthRepo } from "domain/entities/user.entity";
import { T_UserModel } from "infrastructure/persistence/database/Schemas/User.Model";
import mongoose from "mongoose";

export class UserAuthRepo implements I_AuthRepo {
  private readonly model: T_UserModel;

  constructor(model: T_UserModel) {
    this.model = model;
  }

  async createUser(
    userData: Partial<mongoose.Document>
  ): Promise<mongoose.Document> {
    try {
      const newUser = new this.model(userData);
      return await newUser.save();
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.model.findOne({ email });
      return user !== null;
    } catch (error: any) {
      throw new Error(`Failed to check email: ${error.message}`);
    }
  }

  async checkUserNameExists(userName: string): Promise<boolean> {
    try {
      const user = await this.model.findOne({ userName });
      return user !== null;
    } catch (error: any) {
      throw new Error(`Failed to check username: ${error.message}`);
    }
  }

  async updateProfilePic(
    userId: mongoose.Schema.Types.ObjectId,
    newUrl: string
  ): Promise<mongoose.Document> {
    try {
      const updatedDoc = await this.model.findByIdAndUpdate(
        userId,
        { profilePic: newUrl },
        { new: true }
      );

      if (!updatedDoc) {
        throw new Error("User not found");
      }

      return updatedDoc;
    } catch (error: any) {
      throw new Error(`Failed to update profile picture: ${error.message}`);
    }
  }

  async getUserById(
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<mongoose.Document | null> {
    try {
      return await this.model.findById(userId);
    } catch (error: any) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  async updatePassword(
    userId: mongoose.Schema.Types.ObjectId,
    newHashedPassword: string
  ): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndUpdate(
        userId,
        { hashedPassword: newHashedPassword },
        { new: true }
      );

      return result !== null;
    } catch (error: any) {
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<mongoose.Document | null> {
    try {
      return await this.model.findOne({ email });
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
}

export default UserAuthRepo;
