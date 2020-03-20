import { GraphQLServer } from 'graphql-yoga'
import {connect} from 'mongoose'
 require('dotenv').config()

connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Connected to DB!')
    })
    .catch(err => {
        console.log('error connecting to DB', err.message)
    })

const typeDefs = `
  type Query {
    hello(name: String): String
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => {
      const returnValue = `Hello ${name || 'World!'}`
      return returnValue
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
