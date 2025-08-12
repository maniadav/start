import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "../types/management.types";
import { UserRoleConst } from "../constants/management.constant";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  role: UserRole;
  email: string;
  password: string;
  created_at: Date;
}

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: UserRoleConst,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: { createdAt: "created_at" },
    collection: "users",
  }
);

// Index for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default UserModel;
