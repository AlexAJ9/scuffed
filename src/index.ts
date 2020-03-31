import { merge } from "lodash";
import { connect } from "mongoose";

const { ApolloServer, gql } = require("apollo-server");

require("dotenv").config();

import { User } from "./modules/user/types";
import { queries as userQueries } from "./modules/status/statusQueries";
import { mutations as userMutations } from "./modules/user/userMutations";
import { Status } from "./modules/status/types";
import { queries as statusQueries } from "./modules/status/statusQueries";
import { mutations as statusMutations } from "./modules/status/statusMutations";

connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(err => {
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
const server = new ApolloServer({
  typeDefs: [Query, Mutation, Status, User],
  resolvers: merge(statusQueries, statusMutations)
});

const port = process.env.PORT;

server.listen(port, () => console.log(`🚀Server is running on ${port}`));
