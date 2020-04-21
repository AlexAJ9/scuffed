const { gql } = require("apollo-server");

export const User = gql`
  type User {
    id: String!
    passwordHash: String!
    username: String!
    description: String
    profile_image_url: String
    statuses: [Status!]
    statuses_count: Int
    friend: [User!]
    favorites: [Status!]
    favorites_count: Int
  }

  extend type Query {
    allUsers: [User!]
    usersCount: Int
    getUserInfo(id: String!): User!
  }
  type Token {
    value: String!
  }
  extend type Mutation {
    login(username: String!, password: String!): Token
    addUser(username: String!, password: String!): User
    editUser(id: String!, username: String, description: String): User
    friendUser(id: String!): User
  }
`;
