import Status from "../../models/Status";

const ADD_STATUS = "ADD_STATUS";
const EDIT_STATUS = "EDIT_STATUS";
const DELETE_STATUS = "DELETE_STATUS";
const COMMENT = "COMMENT";
const LIKE_STATUS = "LIKE_STATUS";

const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");
const pubsub = new PubSub();

export const mutations = {
  Mutation: {
    addStatus: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError(
          "You must be logged in to perform this action!"
        );
      }

      const newStatus = new Status({
        ...args,
        userId: currentUser._id,
        username: currentUser.username,
      });

      try {
        const savedStatus = await newStatus.save();
        currentUser.statuses = currentUser.statuses.concat(savedStatus.id);
        await currentUser.save();

        pubsub.publish(ADD_STATUS, { newStatus: savedStatus });
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
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
        };
        const updatedStatus = await Status.findByIdAndUpdate(
          args.id,
          statusObj,
          { new: true }
        );
        pubsub.publish(EDIT_STATUS, { statusEdited: updatedStatus });
        return updatedStatus;
      } catch (err) {
        return new UserInputError(err, {
          invalidArgs: args,
        });
      }
    },
    likeStatus: async (root, args, { currentUser }) => {
      try {   
        const statusToLike = await Status.findById(args.id);
        if (currentUser.favorites.includes(statusToLike.id)) {
          const updatedStatus = await Status.findByIdAndUpdate(
            args.id,
            { likes: statusToLike.likes - 1 },
            { new: true }
          );

          // pubsub.publish(LIKE_STATUS, { updatedStatus: updatedStatus });
          console.log(currentUser.favorites);
          currentUser.favorites = currentUser.favorites.filter(
            (x) => x.toString() !== args.id.toString()
          );

          await currentUser.save();
          return updatedStatus;
        } else {
          const updatedStatus = await Status.findByIdAndUpdate(
            args.id,
            { likes: statusToLike.likes + 1 },
            { new: true }
          );
          currentUser.favorites = currentUser.favorites.concat(args.id);
          await currentUser.save();
          return updatedStatus;
        }
      } catch (err) {
        throw new UserInputError(err, {
          invalidArgs: args,
        });
      }
    },
    addComment: async (root, args, { currentUser }) => {
      try {
        const comment = {
          text: args.comment,
          user: currentUser.username,
        };

        const statusToUpdate = await Status.findById(args.id);
        const comments = statusToUpdate.comments.concat(comment);

        const status = await Status.findByIdAndUpdate(
          args.id,
          { comments: comments },
          { new: true }
        );
        pubsub.publish(LIKE_STATUS, { addComment: status });
        return status;
      } catch (err) {
        throw new UserInputError(err, {
          invalidArgs: args,
        });
      }
    },
    deleteStatus: async (root, args, { currentUser }) => {
      await Status.findByIdAndRemove(args.id);
      currentUser.statuses = currentUser.statuses.filter(
        (status) => status.id !== args.id
      );
      await currentUser.save();
    },
  },
  Subscription: {
    newStatus: {
      subscribe: () => pubsub.asyncIterator([ADD_STATUS]),
    },
    editStatus: {
      subscribe: () => pubsub.asyncIterator([EDIT_STATUS]),
    },
    deleteStatus: {
      subscribe: () => pubsub.asyncIterator([DELETE_STATUS]),
    },
    addComment: {
      subscribe: () => pubsub.asyncIterator([COMMENT]),
    },
  },
};
