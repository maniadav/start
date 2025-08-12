import mongoose from "mongoose";

const TempTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true }, // Store hashed refresh token
  type: { type: String, enum: ["refresh"], default: "refresh" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  device: { type: String }, // Optional: device info or user agent
  revoked: { type: Boolean, default: false },
});

const TempTokenModel =
  mongoose.models.TempToken || mongoose.model("temp-token", TempTokenSchema);
export default TempTokenModel;
