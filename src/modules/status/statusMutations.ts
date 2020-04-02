import Status from "../../models/Status";
const { UserInputError, AuthenticationError } = require("apollo-server");

export const mutations = {
  Mutation: {
    addStatus: async (root, args) => {
      const newStatus = new Status({ ...args });
      try {
        await newStatus.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args
        });
      }
      return newStatus;
    },
    editStatus: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("wrong password or usernmae");
      }
      try {
        const statusObj = {
          status_text: args.status_text,
          status_tags: args.status_tags,
          status_picture_url: args.status_picture_url
        };
        const updatedStatus = await Status.findByIdAndUpdate(
          args.id,
          statusObj,
          { new: true }
        );
        return updatedStatus;
      } catch (err) {
        return new UserInputError(err, {
          invalidArgs: args
        });
      }
    },
    starStatus: async (root, args) => {
      try {
        const stars = await (await Status.findById(args.id)).stars;
        const updatedStatus = await Status.findByIdAndUpdate(
          args.id,
          { stars: stars + 1 },
          { new: true }
        );
        return updatedStatus;
      } catch (err) {
        throw new UserInputError(err, {
          invalidArgs: args
        });
      }
    },
    comment: async (root, args) => {
      try {
        const statusToUpdate = await Status.findById(args.id);
        const status = await Status.findByIdAndUpdate(
          args.id,
          { comments: statusToUpdate.comments.concat(args.comment) },
          { new: true }
        );
        return status;
      } catch (err) {
        throw new UserInputError(err, {
          invalidArgs: args
        });
      }
    }
  }
};
