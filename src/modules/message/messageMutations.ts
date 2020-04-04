const { PubSub } = require("apollo-server");
import Message from "../../models/Message";

const pubsub = new PubSub();

export const mutations = {
  Mutation: {
    creatingMessage: async (root, args) => {
      pubsub.publish("creatingMessage", {
        user: args.username,
        receiver: args.receiverUsername
      });
      return true;
    },
    sendMessage: async (root, args) => {
      const messageObj = new Message({
        message: args.message,
        senderUsername: args.senderUsername,
        receiverUsername: args.receiverUsername,
        timestamp: args.timestamp
      });

      await messageObj.save();
      pubsub.publish("newMessage", {
        newMessage: messageObj,
        receiverUsername: args.receiverUsername
      });
      return messageObj;
    },
    updateMessage: async (root, args) => {
      const messageToUpdate = await Message.findByIdAndUpdate(
        args.id,
        { message: args.message },
        { new: true }
      );
      return messageToUpdate;
    },
    deleteMessage: async (root, args) => {
      await Message.findOneAndDelete(args.id);
      return true;
    }
  }
};
