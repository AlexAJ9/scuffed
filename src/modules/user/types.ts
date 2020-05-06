const { gql } = require("apollo-server");

export const User = gql`
  type User {
    id: String!
    passwordHash: String!
    username: String!
    name: String
    description: String
    profile_image_url: String
    statuses: [String!]
    statuses_count: Int
    friends: [String!]
    favorites: [String!]
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
  type UserWithToken {
    token: String!
    user: User!
  }
  extend type Mutation {
    login(username: String!, password: String!): UserWithToken
    addUser(username: String!, password: String!): User
    editUser(
      id: String!
      username: String!
      name: String!
      profile_image_url: String!
      description: String!
    ): User
    friendUser(id: String!): User
  }
`;
