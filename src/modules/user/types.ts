const { gql } = require("apollo-server");

export const User = gql`
  type User {
    id: String!
    passwordHash: String!
    screen_name: String!
    description: String!
    profile_image_url: String!
    statuses: [Status!]!
    statuses_count: Int
    friend: [Users!]!
    favorites: [Status!]!
    favorites_count: Int
  }

  type Query {
    usersCount: Int!
    getUserInfo: User!
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
  }
`;
