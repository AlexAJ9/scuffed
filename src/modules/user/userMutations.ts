const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import User from "../../models/User";
const { UserInputError, AuthenticationError } = require("apollo-server");

export const mutations = {
  Mutation: {
    addUser: async (root, args) => {
      try {
        console.log("beh");
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(args.password, saltRounds);
        console.log(passwordHash);
        const newUser = new User({
          username: args.username,
          passwordHash: passwordHash
        });
        console.log(newUser);
        await newUser.save();
        return newUser;
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        });
      }
    },
    editUser: async (root, args, { currentUser }) => {
      if (!currentUser) {
        console.log("beh");
        throw new AuthenticationError("bitch");
      }
      const userObj = {
        username: args.username,
        description: args.description
      };
      const usetToEdit = await User.findByIdAndUpdate(args.id, userObj, {
        new: true
      });
      return usetToEdit;
    },
    friendUser: async (root, args) => {
      const userToEdit = await User.findByIdAndUpdate(
        args.id,
        {
          friends: args.friends.concat(args.friendId)
        },
        { new: true }
      );
      return userToEdit;
    }
  }
};
