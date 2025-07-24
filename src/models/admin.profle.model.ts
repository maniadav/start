import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { Status } from "../types/management.types";

export interface IAdminProfile extends Document {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  address: string;
  name: string;
  email: string;
  permission: Record<string, any>;
  status: Status;
  joined_on: Date;
  updated_on: Date;
}

const AdminProfileSchema = new Schema<IAdminProfile>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    permission: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "pending", "blocked"],
      default: "pending",
    },
    joined_on: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: { updatedAt: "updated_on" },
    collection: "admin_profiles",
  }
);

const AdminProfileModel =
  mongoose.models.AdminProfile ||
  mongoose.model<IAdminProfile>("AdminProfile", AdminProfileSchema);

export default AdminProfileModel;
