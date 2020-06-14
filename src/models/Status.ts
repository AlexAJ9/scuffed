import { Schema, Document, model } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

interface Status extends Document {
  status_text: string;
  created_at: Date;
  status_picture_url: string;
  status_tags: string[];
  userId: string;
  username: string;
  favorites_count: number;
  comments: { text: string; user: string }[];
  likes: number;
}
const statusSchema = new Schema({
  status_text: { type: String },
  created_at: { type: Date, default: Date.now },
  status_picture_url: { type: String },
  status_tags: [{ type: String }],
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  username: { type: String },
  favorites_count: { type: Number },
  comments: [{ text: String, user: String }],
  likes: { type: Number, default: 0 },
});

statusSchema.plugin(uniqueValidator);
const Status = model<Status>("Status", statusSchema);

export default Status;
