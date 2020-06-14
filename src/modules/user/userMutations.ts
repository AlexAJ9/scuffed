import User from "../../models/User";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");
const pubsub = new PubSub();

const EDIT_USER = "EDIT_USER";
const FRIEND_USER = "FRIEND_USER";

export const mutations = {
  Mutation: {
    addUser: async (root, args) => {
      try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(args.password, saltRounds);

        const newUser = new User({
          username: args.username,
          passwordHash: passwordHash,
        });

        await newUser.save();
        return newUser;
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
    },
    editUser: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("bitch");
      }
      const userObj = {
        username: args.username,
        name: args.name,
        profile_image_url: args.profile_image_url,
        description: args.description,
      };
      const usetToEdit = await User.findByIdAndUpdate(args.id, userObj, {
        new: true,
      });
      pubsub.publish(EDIT_USER, {
        user: usetToEdit,
      });
      return usetToEdit;
    },
    friendUser: async (root, args, { currentUser }) => {
      if (currentUser.friends.includes(args.id)) {
        currentUser.friends = currentUser.friends.filter((status) => {
          status !== args.id;
        });

        await currentUser.save();
        pubsub.publish(FRIEND_USER, {
          user: currentUser,
        });
        return currentUser;
      } else {
        currentUser.friends = currentUser.friends.concat(args.id);

        await currentUser.save();
        pubsub.publish(FRIEND_USER, {
          user: currentUser,
        });
        return currentUser;
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      const passCorrect =
        user === null
          ? false
          : await bcrypt.compare(args.password, user.passwordHash);
      if (!passCorrect) {
        throw new UserInputError({ message: "Wrong password buddeh?" });
      }
      const userToken = {
        id: user._id,
        username: args.username,
      };
      const token = await jwt.sign(userToken, process.env.Secret);
      return { token: token, user: user };
    },
  },
  Subscription: {
    editUser: {
      subscribe: () => pubsub.asyncIterator([EDIT_USER]),
    },
    friendUser: {
      subscribe: () => pubsub.asyncIterator([FRIEND_USER]),
    },
  },
};
