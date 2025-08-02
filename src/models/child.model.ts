import mongoose, { Document, Schema } from "mongoose";
import { IObserverProfile } from "./observer.profile.model";
import { IOrganisationProfile } from "./organisation.profile.model";
import { Gender } from "../types/management.types";

export interface IChild extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  address: string;
  observer_id: IObserverProfile["_id"];
  organisation_id: IOrganisationProfile["_id"];
  gender: Gender;
  date_joined: Date;
  survey_note: string; // Note for the survey
  survey_date: Date;
  survey_attempt: number; // Number of attempts made for the survey
  survey_status?: "pending" | "in_progress" | "completed" | "paused";
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
    survey_note: {
      type: String,
      default: "",
    },
    date_joined: {
      type: Date,
      default: Date.now,
    },
    survey_attempt: {
      type: Number,
      default: 0,
      min: 0,
    },
    survey_status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "paused", "rejected"],
      default: "pending",
    },
  },
  {
    collection: "children",
  }
);

// Indexes for better query performance
ChildSchema.index({ observer_id: 1 });
ChildSchema.index({ organisation_id: 1 });
ChildSchema.index({ survey_date: 1 });
ChildSchema.index({ gender: 1 });

const ChildModel =
  mongoose.models.Child || mongoose.model<IChild>("Child", ChildSchema);
export default ChildModel;
