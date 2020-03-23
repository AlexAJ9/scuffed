import Status from '../models/Status'

const { gql } = require('apollo-server')

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

export const resolvers = {
    Query: { 
        statusCount: () => { return Status.collection.countDocuments() },
        allStatuses:() => { return Status.find({}) }
    },
    Mutation: {
        addStatus:(root, args) => {
            const newStatus = new Status({ ...args })
            return newStatus.save()
        },
        editStatus: async (root, args) => {
            const statusObj = {
                status_text: args.status_text,
                status_tags: args.status_tags,
                status_picture_url:args.status_picture_url,
            }
            const updatedStatus = await Status.findByIdAndUpdate(args.id,statusObj, { new: true })
            return updatedStatus
        },
        starStatus: async (root, args) => { 
            const stars = await (await Status.findById(args.id)).toObject().stars            
            const updatedStatus = await Status.findByIdAndUpdate(args.id, { stars: stars + 1 }, { new: true })
            return updatedStatus
        },
        comment: async (root, args) => { 
            const statusToUpdate = await (await Status.findById(args.id)).toObject()
            const status = await Status.findByIdAndUpdate(args.id, { comments:statusToUpdate.comments.concat(args.comment) }, { new: true })
            return status
        }
    }
    
}