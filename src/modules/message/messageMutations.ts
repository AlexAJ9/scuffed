import Message from "../../models/Message";

const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const NEW_MESSAGE = "NEW_MESSAGE";

export const mutations = {
  Mutation: {
    sendMessage: async (root, args) => {
      const messageObj = new Message({
        message: args.message,
        senderUsername: args.senderUsername,
        receiverUsername: args.receiverUsername,
      });

      await messageObj.save();
      pubsub.publish(NEW_MESSAGE, {
        newMessage: messageObj,
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
    },
  },
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator([NEW_MESSAGE]),
    },
  },
};
