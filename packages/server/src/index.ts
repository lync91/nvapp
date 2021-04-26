import path from 'path'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './graphql/schemasMap'

const PORT = 4000

const app = express()
const server = new ApolloServer({
  schema,
})
server.applyMiddleware({ app, path: '/graphql' })
// app.use('/public', express.static('public'))
// app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public')))
app.listen(PORT, () => {
  console.log(`\n🚀      GraphQL is now running on http://localhost:${PORT}/graphql`)
})
