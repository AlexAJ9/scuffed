import Status from "../../models/Status";
const { UserInputError, AuthenticationError } = require("apollo-server");

export const mutations = {
  Mutation: {
    addStatus: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError(
          "You must be logged in to perform this action!"
        );
      }
      console.log(currentUser);
      const newStatus = new Status({
        ...args,
        user: currentUser._id,
        username: currentUser.username,
      });
      try {
        const savedStatus = await newStatus.save();
        currentUser.statuses = currentUser.statuses.concat(savedStatus.id);
        await currentUser.save();
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
        return updatedStatus;
      } catch (err) {
        return new UserInputError(err, {
          invalidArgs: args,
        });
      }
    },
    starStatus: async (root, args, { currentUser }) => {
      try {
        const statusToLike = await Status.findById(args.id);
        if (currentUser.favorites.includes(statusToLike.id)) {
          const updatedStatus = await Status.findByIdAndUpdate(
            args.id,
            { stars: statusToLike.stars - 1 },
            { new: true }
          );

          currentUser.favorites = currentUser.favorites.filter((status) => {
            status !== args.id;
          });
          console.log(currentUser.favorites);
          await currentUser.save();
          return updatedStatus;
        } else {
          const updatedStatus = await Status.findByIdAndUpdate(
            args.id,
            { stars: statusToLike.stars + 1 },
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
    comment: async (root, args, { currentUser }) => {
      try {
        const comment = {
          text: args.comment,
          user: currentUser.username,
        };
        console.log(comment);
        const statusToUpdate = await Status.findById(args.id);
        const status = await Status.findByIdAndUpdate(
          args.id,
          { comments: statusToUpdate.comments.concat(comment) },
          { new: true }
        );

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
};
