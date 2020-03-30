import User from "../../models/User";

export const queries = {
  Query: {
    usersCount: () => {
      return User.collection.countDocuments();
    },
    allUsers: async (root, args) => {
      return User.find({});
    },
    getUserInfo: async (root, args) => {
      return User.findById({ id: args.id });
    }
  }
};
