import { Schema, Document, model } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

interface Status extends Document {
  status_text: string;
  created_at: string;
  status_picture_url: string;
  status_tags: string[];
  user: string;
  favorites_count: number;
  comments: string;
  stars: number;
}
const statusSchema = new Schema({
  status_text: { type: String },
  created_at: { type: Date },
  status_picture_url: { type: String },
  status_tags: [{ type: String }],
  user: { type: Schema.Types.ObjectId, ref: "User" },
  favorites_count: { type: Number },
  comments: [{ type: String }],
  stars: { type: Number, default: 0 }
});

statusSchema.plugin(uniqueValidator);
const Status = model<Status>("Status", statusSchema);

export default Status;
