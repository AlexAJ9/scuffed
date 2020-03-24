const { gql} = require('apollo-server')

export const typeDefs = gql`

 type Status {
     id:String!,
    status_text: String!,
    created_at: String!,
    status_picture_url: String,
    status_tags: [String!]!,
    user: String!,
    favorites_count: Int!,
    comments:[String!]!,
    stars:Int
}

type Query {
    statusCount: Int!,
    allStatuses: [Status!]!,
}

type Mutation {
    addStatus(
        status_text:String!,
        status_tags:[String!]!,
        user: String!,
        stars:Int
        ):Status,
    editStatus(
        id:String!,
        status_text:String,
        status_tags: [String!]!,
        status_picture_url: String
        ):Status,
        starStatus(
            id:String!,
        ):Status
    favouriteStatus(
        favourites_count:Int!,
    ):Status,
    comment(
        id:String!,
        comment: String!
    ):Status
}

`