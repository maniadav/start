import mongoose, { Document, Schema } from "mongoose";
import { IOrganisationProfile } from "./organisation.profile.model";
import { IObserverProfile } from "./observer.profile.model";
import { IChild } from "./child.model";
import TASK_TYPE from "../constants/survey.type.constant";

export interface IFile extends Document {
  _id: string;
  title: string;
  task_id: (typeof TASK_TYPE)[number];
  file_size: number;
  organisation_id: IOrganisationProfile["_id"];
  observer_id: IObserverProfile["_id"];
  child_id: IChild["_id"];
  date_created: Date;
  file_url: string;
  created_at: Date;
  last_updated: Date;
}

const FileSchema = new Schema<IFile>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    task_id: {
      type: String,
      required: [true, "Task ID is required"],
      enum: {
        values: TASK_TYPE,
        message: "Task ID must be one of the valid task types",
      },
      trim: true,
    },
    file_size: {
      type: Number,
      required: [true, "File size is required"],
      min: [0, "File size cannot be negative"],
    },
    organisation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrganisationProfile",
      required: [true, "Organisation ID is required"],
    },
    observer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ObserverProfile",
      required: [true, "Observer ID is required"],
    },
    child_id: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: [true, "Child ID is required"],
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
    file_url: {
      type: String,
      required: [true, "File URL is required"],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "last_updated" },
    collection: "files",
  }
);

// Indexes for better query performance
FileSchema.index({ organisation_id: 1 });
FileSchema.index({ observer_id: 1 });
FileSchema.index({ child_id: 1 });
FileSchema.index({ task_id: 1 });
FileSchema.index({ date_created: -1 });

const FileModel =
  mongoose.models.File || mongoose.model<IFile>("File", FileSchema);
export default FileModel;
