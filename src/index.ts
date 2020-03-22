import {connect} from 'mongoose'
import { GraphQLServer } from 'graphql-yoga'

require('dotenv').config()


import { typeDefs as Status, resolvers as statusResolvers } from './types/status'

connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to DB!')
    })
    .catch(err => {
        console.log('error connecting to DB', err.message)
    })


const server = new GraphQLServer({
  typeDefs:Status,
  resolvers:statusResolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
