import { Schema, model, Document } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

interface User extends Document {
  name?: string;
  username: string;
  passwordHash: string;
  description: string;
  profile_image_url: string;
  created_at: string;
  statuses: string[];
  statues_count: number;
  friends: string[];
  favorites: string[];
  favorites_count: number;
}

const userSchema = new Schema({
  name: {
    type: String,
  },
  username: { type: String, required: true, unique: true, minLength: 4 },
  passwordHash: { type: String, required: true },
  description: { type: String, minLength: 8 },
  profile_image_url: { type: String },
  created_at: { type: Date },
  statuses: [{ type: Schema.Types.ObjectId, ref: "Status" }],
  statues_count: { type: Number },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  favorites: [{ type: Schema.Types.ObjectId, ref: "Status" }],
  favorites_count: { type: Number },
});

userSchema.plugin(uniqueValidator);
const User = model<User>("User", userSchema);

export default User;
