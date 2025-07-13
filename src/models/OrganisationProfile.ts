import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { Status } from "../types/management.types";

export interface IOrganisationProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: IUser["_id"];
  unique_id: string;
  address: string;
  name: string;
  status: Status;
  joined_on: Date;
  updated_on: Date;
}

const OrganisationProfileSchema = new Schema<IOrganisationProfile>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    unique_id: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return value.startsWith("OG");
        },
        message: 'Organisation unique ID must start with "OG"',
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
    collection: "organisation_profiles",
  }
);

// Indexes for better query performance
OrganisationProfileSchema.index({ user_id: 1 });
OrganisationProfileSchema.index({ unique_id: 1 });
OrganisationProfileSchema.index({ status: 1 });

// Pre-save middleware to generate unique_id if not provided
OrganisationProfileSchema.pre("save", async function (next) {
  if (!this.unique_id) {
    const count = await mongoose.model("OrganisationProfile").countDocuments();
    this.unique_id = `OG${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

export const OrganisationProfile =
  mongoose.models.OrganisationProfile ||
  mongoose.model<IOrganisationProfile>(
    "OrganisationProfile",
    OrganisationProfileSchema
  );
