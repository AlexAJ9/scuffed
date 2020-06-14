const { gql } = require("apollo-server");

export const Message = gql`
  type Message {
    id: ID!
    message: String!
    senderUsername: String!
    receiverUsername: String!
    timestamp: String
    user: [User!]
  }

  extend type Query {
    messages: [Message!]
  }

  extend type Mutation {
    sendMessage(
      senderUsername: String!
      receiverUsername: String!
      message: String!
      timestamp: String
    ): Message!
    updateMessage(id: ID!, message: String!): Message!
    deleteMessage(id: String!): Boolean!
  }

  extend type Subscription {
    newMessage: Message!
  }
`;
