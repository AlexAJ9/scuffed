const { gql } = require("apollo-server");

export const Message = gql`
  type Message {
    id: ID!
    message: String!
    senderUsername: String!
    receiverUsernmae: String!
    timestamp: String!
    user: [String!]
  }

  extend type Query {
    messages: [Message!]
  }

  extend type Mutation {
    creatingMessage(username: String!, receiverUsername: String!): Boolean!
    sendMessage(
      username: String!
      receiverUsernanem: String!
      message: String!
      timestamp: String
    ): Message!
    updateMessage(id: ID!, message: String!): Message!
    deleteMessage(id: String!): Boolean!
  }
`;
