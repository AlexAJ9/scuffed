import { Schema, model, Document } from "mongoose";
import * as uniqueValidator from "mongoose-unique-validator";

interface Message extends Document {
  message: string;
  senderUsername: string;
  receiverUsername: string;
  timestamp: Date;
}

const messageSchema = new Schema({
  message: { type: String, required: true },
  senderUsername: { type: String, required: true },
  receiverUsername: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

messageSchema.plugin(uniqueValidator);
const Message = model<Message>("Message", messageSchema);

export default Message;
