import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { Status } from "../types/management.types";

export interface IAdminProfile extends Document {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  address: string;
  name: string;
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
    timestamps: { createdAt: false, updatedAt: "updated_on" },
    collection: "admin_profiles",
  }
);

// Indexes for better query performance
AdminProfileSchema.index({ user_id: 1 }, { unique: true });
AdminProfileSchema.index({ status: 1 });

export const AdminProfile =
  mongoose.models.AdminProfile ||
  mongoose.model<IAdminProfile>("AdminProfile", AdminProfileSchema);
