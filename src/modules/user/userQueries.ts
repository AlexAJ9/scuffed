const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import User from "../../models/User";
const { UserInputError } = require("apollo-server");

export const queries = {
  Query: {
    usersCount: () => {
      return User.collection.countDocuments();
    },
    allUsers: async (root, args) => {
      return User.find({});
    },
    getUserInfo: async (root, args) => {
      return User.findById(args.id);
    },
  },
};
