const { gql } = require("apollo-server-express");

//types query/mutation/subscription
module.exports = gql`
  type Project {
    _id: String!
    project_id: Int
    project_code: String
    project_title: String
    description: String
    diadiem: String
  }

  type Query {
    Projects: [Project!]
  }

  # input type
  input PostInput {
    title: String!
    description: String!
  }

  # mutations
  type Mutation {
    newPost(input: PostInput!): Post!
  }
`;
