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
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);
      if (!passCorrect) {
        console.log("he");
        throw new UserInputError({ message: "Wrong password buddeh?" });
      }
      const userToken = {
        id: user._id,
        username: args.username
      };
      const token = await jwt.sign(userToken, process.env.Secret);
      return { value: token };
    }
  }
};
