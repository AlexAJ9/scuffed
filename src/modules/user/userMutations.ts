const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import User from "../../models/User";
const { UserInputError } = require("apollo-server");

export const mutations = {
  Mutation: {
    addUser: async (root, args) => {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(args.password, saltRounds);
      const newUser = new User({ ...args, passwordHash: passwordHash });
      try {
        await newUser.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        });
      }
      return newUser;
    },
    editUser: async (root, args) => {
      const usetToEdit = await User.findByIdAndUpdate(
        { ...args },
        { new: true }
      );
      return usetToEdit;
    },
    friendUser: async (root, args) => {
      const user = await User.findById(args.id);
      const userToEdit = await User.findByIdAndUpdate(
        args.id,
        {
          friends: args.friends.concat(args.friendId)
        },
        { new: true }
      );
      return userToEdit;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);
    }
  }
};
