import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { IOrganisationProfile } from "./OrganisationProfile";
import { Status } from "../types/management.types";

export interface IObserverProfile extends Document {
  _id: mongoose.Types.ObjectId;
  user_id: IUser["_id"];
  unique_id: string;
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
    },
    unique_id: {
      type: String,
      required: [true, "Unique ID is required"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return value.startsWith("OB");
        },
        message: 'Observer unique ID must start with "OB"',
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

// Indexes for better query performance
ObserverProfileSchema.index({ user_id: 1 });
ObserverProfileSchema.index({ unique_id: 1 });
ObserverProfileSchema.index({ organisation_id: 1 });
ObserverProfileSchema.index({ status: 1 });

// Pre-save middleware to generate unique_id if not provided
ObserverProfileSchema.pre("save", async function (next) {
  if (!this.unique_id) {
    const count = await mongoose.model("ObserverProfile").countDocuments();
    this.unique_id = `OB${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

export const ObserverProfile =
  mongoose.models.ObserverProfile ||
  mongoose.model<IObserverProfile>("ObserverProfile", ObserverProfileSchema);
