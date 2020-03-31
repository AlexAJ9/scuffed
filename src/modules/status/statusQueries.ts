import Status from "../../models/Status";
const { UserInputError } = require("apollo-server");

export const queries = {
  Query: {
    statusCount: () => {
      return Status.collection.countDocuments();
    },
    allStatuses: () => {
      return Status.find({});
    },
    findStatus: async (root, args) => {
      try {
        const status = await Status.findById(args.id);
        return status;
      } catch (err) {
        return new UserInputError(err, {
          invalidArgs: args
        });
      }
    }
  }
};
