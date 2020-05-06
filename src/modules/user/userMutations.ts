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
          passwordHash: passwordHash,
        });
        console.log(newUser);
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
        console.log("beh");
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
      return usetToEdit;
    },
    friendUser: async (root, args, { currentUser }) => {
      console.log(args.id);
      if (currentUser.friends.includes(args.id)) {
        currentUser.friends = currentUser.friends.filter((status) => {
          status !== args.id;
        });

        console.log(currentUser.friends + "yes");
        await currentUser.save();
        return currentUser;
      } else {
        currentUser.friends = currentUser.friends.concat(args.id);
        console.log(currentUser.friends + "no");
        await currentUser.save();
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
        console.log("he");
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
};
