import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { Status } from "../types/management.types";

export interface IOrganisationProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: IUser["_id"];
  email: string;
  address: string;
  name: string;
  status: Status;
  joined_on: Date | null;
  updated_on: Date;
}

const OrganisationProfileSchema = new Schema<IOrganisationProfile>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email: string) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "Please enter a valid email",
      },
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
    status: {
      type: String,
      required: true,
      enum: ["active", "pending", "blocked"],
      default: "pending",
    },
    joined_on: {
      type: Date,
      default: null,
      immutable: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updated_on" },
    collection: "organisation_profiles",
  }
);

// Indexes for better query performance
OrganisationProfileSchema.index({ user_id: 1 }, { unique: true });
OrganisationProfileSchema.index({ email: 1 }, { unique: true });
OrganisationProfileSchema.index({ status: 1 });

export const OrganisationProfile =
  mongoose.models.OrganisationProfile ||
  mongoose.model<IOrganisationProfile>(
    "OrganisationProfile",
    OrganisationProfileSchema
  );
