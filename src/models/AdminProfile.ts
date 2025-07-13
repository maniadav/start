import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { Status } from "../types/management.types";

export interface IAdminProfile extends Document {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  unique_id: string;
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
    },
    unique_id: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return value.startsWith("AD");
        },
        message: 'Admin unique ID must start with "AD"',
      },
      trim: true,
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
AdminProfileSchema.index({ user_id: 1 });
AdminProfileSchema.index({ unique_id: 1 });
AdminProfileSchema.index({ status: 1 });

// Pre-save middleware to generate unique_id if not provided
AdminProfileSchema.pre("save", async function (next) {
  if (!this.unique_id) {
    const count = await mongoose.model("AdminProfile").countDocuments();
    this.unique_id = `AD${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

export const AdminProfile =
  mongoose.models.AdminProfile ||
  mongoose.model<IAdminProfile>("AdminProfile", AdminProfileSchema);
