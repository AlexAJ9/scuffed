const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
const NEW_MESSAGE = "NEW_MESSAGE";

export const subscriptions = {
  Subscription: {
    newMessage: {
      subscribe: () => pubsub.asyncIterator([NEW_MESSAGE]),
    },
  },
};
