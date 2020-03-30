const { gql } = require("apollo-server");

export const User = gql`
  type User {
    id: String!
    passwordHash: String!
    username: String!
    description: String!
    profile_image_url: String!
    statuses: [Status!]!
    statuses_count: Int
    friend: [Users!]!
    favorites: [Status!]!
    favorites_count: Int
  }

  type Query {
    allUsers: [Users!]!
    usersCount: Int!
    getUserInfo: User!
  }
  type Token {
    value: String!
  }
  type Mutation {
    addUser(name: String!, passwordHash: String!): User
    editUser(
      id: String!
      passwordHash: String!
      screen_name: String!
      description: String!
      profile_image_url: String!
    ): User
    friendUser(id: String!): User
    Login(username: String!, passwordHash: String!): Token
  }
`;
