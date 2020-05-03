const { gql } = require("apollo-server");

export const Status = gql`
  type Status {
    id: String!
    status_text: String!
    created_at: String!
    status_picture_url: String
    status_tags: [String!]
    user: String!
    username: String!
    comments: [Comment!]
    stars: Int
  }
  type Comment {
    text: String!
    user: String!
  }
  extend type Query {
    statusCount: Int!
    allStatuses: [Status!]!
    findStatus(id: String!): Status
  }

  extend type Mutation {
    addStatus(
      status_text: String!
      status_picture_url: String
      status_tags: [String!]
      user: String
      username: String
      stars: Int
    ): Status
    editStatus(
      id: String!
      status_text: String
      status_tags: [String!]!
      status_picture_url: String
    ): Status
    starStatus(id: String!): Status
    comment(id: String!, comment: String!): Status
    deleteStatus(id: String): Status
  }
`;
