import { merge } from "lodash";
import { connect } from "mongoose";
import User from "./models/User";
const jwt = require("jsonwebtoken");
const { ApolloServer, gql, context, PubSub } = require("apollo-server");

const pubsub = new PubSub();
require("dotenv").config();

import { User as UserType } from "./modules/user/types";
import { queries as userQueries } from "./modules/user/userQueries";
import { mutations as userMutations } from "./modules/user/userMutations";
import { Status } from "./modules/status/types";
import { subscriptions as statusSubscriptions } from "./modules/status/statusSubscriptions";
import { queries as statusQueries } from "./modules/status/statusQueries";
import { mutations as statusMutations } from "./modules/status/statusMutations";
import { Message as MessageType } from "./modules/message/types";
import { queries as messageQueries } from "./modules/message/messageQueries";
import { mutations as messageMutations } from "./modules/message/messageMutations";

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("error connecting to DB", err.message);
  });

const Query = gql`
  type Query {
    _empty: String
  }
`;
const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;
const Subscription = gql`
  type Subscription {
    _empty: String
  }
`;
const server = new ApolloServer({
  typeDefs: [Query, Mutation, Subscription, Status, UserType, MessageType],
  resolvers: merge(
    statusQueries,
    statusMutations,
    statusSubscriptions,
    userQueries,
    userMutations,
    messageQueries,
    messageMutations
  ),
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.Secret);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

const port = process.env.PORT;

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
