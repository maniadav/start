import mongoose, { Document, Schema } from "mongoose";
import { IObserverProfile } from "./ObserverProfile";
import { IOrganisationProfile } from "./OrganisationProfile";
import { Gender } from "../types/management.types";

export interface IChild extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  address: string;
  observer_id: IObserverProfile["_id"];
  organisation_id: IOrganisationProfile["_id"];
  gender: Gender;
  survey_date: Date;
  date_created: Date;
  // New fields for survey tracking (added in migration 002)
  last_survey_date?: Date;
  total_surveys?: number;
  survey_status?: 'pending' | 'in_progress' | 'completed' | 'paused';
}

const ChildSchema = new Schema<IChild>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    observer_id: {
      type: Schema.Types.ObjectId,
      ref: "ObserverProfile",
      required: [true, "Observer ID is required"],
    },
    organisation_id: {
      type: Schema.Types.ObjectId,
      ref: "OrganisationProfile",
      required: [true, "Organisation ID is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female", "other"],
    },
    survey_date: {
      type: Date,
      required: [true, "Survey date is required"],
    },
    // Optional fields for survey tracking
    last_survey_date: {
      type: Date,
      default: null,
    },
    total_surveys: {
      type: Number,
      default: 0,
      min: 0,
    },
    survey_status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'paused'],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: "date_created" },
    collection: "children",
  }
);

// Indexes for better query performance
ChildSchema.index({ observer_id: 1 });
ChildSchema.index({ organisation_id: 1 });
ChildSchema.index({ survey_date: 1 });
ChildSchema.index({ gender: 1 });

export const Child =
  mongoose.models.Child || mongoose.model<IChild>("Child", ChildSchema);
