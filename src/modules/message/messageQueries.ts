import Message from "../../models/Message";

export const queries = {
  Query: {
    messages: async (root, args) => {
      return Message.find({});
    },
  },
};
