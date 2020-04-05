const { withFilter, PubSub } = require("apollo-server");

const pubsub = new PubSub();

export const subscriptions = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("newMessage"),
        (payload, variables) => {
          return payload.receiverUsername === variables.receiverUsername;
        }
      )
    },
    newUser: {
      subscribe: (_, {}, { pubsub }) => {
        return pubsub.asyncIterator("newUser");
      }
    },
    oldUser: {
      subscribe: (_, {}, { pubsub }) => {
        return pubsub.asyncIterator("oldUser");
      }
    },
    creatingMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("creatingMessage"),
        (payload, variables) => {
          return (payload.receiverUsername = payload.receiverUsername);
        }
      )
    }
  }
};
