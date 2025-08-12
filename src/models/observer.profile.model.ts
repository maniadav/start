import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { IOrganisationProfile } from "./organisation.profile.model";
import { Status } from "../types/management.types";

export interface IObserverProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: IUser["_id"];
  email: string;
  address: string;
  name: string;
  organisation_id: IOrganisationProfile["_id"];
  status: Status;
  joined_on: Date;
  updated_on: Date;
}

const ObserverProfileSchema = new Schema<IObserverProfile>(
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
    organisation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganisationProfile",
      required: [true, "Organisation ID is required"],
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
      immutable: true, // This prevents the field from being updated
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: "updated_on" },
    collection: "observer_profiles",
  }
);

const ObserverProfileModel =
  mongoose.models.ObserverProfile ||
  mongoose.model<IObserverProfile>("ObserverProfile", ObserverProfileSchema);

export default ObserverProfileModel;
