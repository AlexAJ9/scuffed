const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

export const subscriptions = {
  Subscription: {
    addStatus: {
      subscribe: () => pubsub.asyncIterator(["STATUS_ADDED"]),
    },
  },
};
