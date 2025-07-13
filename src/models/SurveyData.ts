import mongoose, { Document, Schema } from "mongoose";
import { IChild } from "./Child";

// Base interface for all survey attempts
export interface ISurveyAttempt {
  attempt_number: number;
  time_taken?: string;
  time_limit?: string;
  start_time?: Date;
  end_time?: Date;
  closed_with_timeout?: boolean;
  closed_midway?: boolean;
  screen_height?: number;
  screen_width?: number;
  device_type?: string;
}

// Motor Following Task specific data
export interface IMotorFollowingAttempt extends ISurveyAttempt {
  touch_x?: number[];
  touch_y?: number[];
  obj_x?: number[];
  obj_y?: number[];
  ball_coordinates?: Array<{ x: number; y: number; timestamp: number }>;
  mouse_coordinates?: Array<{ x: number; y: number; timestamp: number }>;
}

// Bubble Popping Task specific data
export interface IBubblePoppingAttempt extends ISurveyAttempt {
  bubbles_popped?: number;
  bubbles_total?: number;
  bubble_coordinates?: Array<{ x: number; y: number; color: string; popped: boolean }>;
  colors?: string[];
}

// Survey Document Interface
export interface ISurveyData extends Document {
  _id: mongoose.Types.ObjectId;
  child_id: IChild["_id"];
  assessment_id: string;
  no_of_attempt: number;
  user_id: string;
  user_dob?: Date;
  user_gender?: string;
  observer_id: string;
  
  // Attempt data - stored as flexible objects to accommodate different task types
  attempt1?: Record<string, any>;
  attempt2?: Record<string, any>;
  attempt3?: Record<string, any>;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

// Base schema for survey attempts
const SurveyAttemptSchema = new Schema({
  attempt_number: { type: Number, required: true, min: 1, max: 3 },
  time_taken: { type: String },
  time_limit: { type: String },
  start_time: { type: Date },
  end_time: { type: Date },
  closed_with_timeout: { type: Boolean, default: false },
  closed_midway: { type: Boolean, default: false },
  screen_height: { type: Number },
  screen_width: { type: Number },
  device_type: { type: String },
}, { _id: false, strict: false }); // strict: false allows additional fields

// Main Survey Data Schema
const SurveyDataSchema = new Schema<ISurveyData>(
  {
    child_id: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: [true, "Child ID is required"],
    },
    assessment_id: {
      type: String,
      required: [true, "Assessment ID is required"],
      enum: [
        "BubblePoppingTask",
        "DelayedGratificationTask", 
        "MotorFollowingTask",
        "ButtonTask",
        "SynchronyTask",
        "LanguageSamplingTask",
        "WheelTask",
        "PreferentialLookingTask"
      ],
    },
    no_of_attempt: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      default: 0,
    },
    user_id: {
      type: String,
      required: [true, "User ID is required"],
    },
    user_dob: { type: Date },
    user_gender: { type: String, enum: ["male", "female", "other"] },
    observer_id: {
      type: String,
      required: [true, "Observer ID is required"],
    },
    
    // Flexible attempt data storage
    attempt1: { type: Schema.Types.Mixed, default: {} },
    attempt2: { type: Schema.Types.Mixed, default: {} },
    attempt3: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "survey_data",
  }
);

// Indexes for efficient querying
SurveyDataSchema.index({ child_id: 1 });
SurveyDataSchema.index({ assessment_id: 1 });
SurveyDataSchema.index({ user_id: 1 });
SurveyDataSchema.index({ observer_id: 1 });
SurveyDataSchema.index({ child_id: 1, assessment_id: 1 }, { unique: true }); // One survey per child per assessment type

// Methods for working with attempts
SurveyDataSchema.methods.addAttempt = function(attemptNumber: number, attemptData: Record<string, any>) {
  if (attemptNumber < 1 || attemptNumber > 3) {
    throw new Error('Attempt number must be between 1 and 3');
  }
  
  const attemptField = `attempt${attemptNumber}` as keyof ISurveyData;
  this[attemptField] = {
    ...attemptData,
    attempt_number: attemptNumber,
    timestamp: new Date(),
  };
  
  // Update attempt counter
  this.no_of_attempt = Math.max(this.no_of_attempt, attemptNumber);
  
  return this.save();
};

SurveyDataSchema.methods.getAttempt = function(attemptNumber: number) {
  if (attemptNumber < 1 || attemptNumber > 3) {
    throw new Error('Attempt number must be between 1 and 3');
  }
  
  const attemptField = `attempt${attemptNumber}` as keyof ISurveyData;
  return this[attemptField];
};

export const SurveyData = 
  mongoose.models.SurveyData || mongoose.model<ISurveyData>("SurveyData", SurveyDataSchema);
