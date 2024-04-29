import { ApolloServer, gql } from 'apollo-server';
import { setupDB } from './utils/database';
import { CreateIssue } from './types';
import { logger } from './utils/logger';
import { createIssue, getIssues } from './entities/issues';

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    imageUrl: String
  }

  enum IssueType { 
    MISSING_ITEM,
    DAMAGE,
    OTHER
  }

  type Issue {
    id: ID!
    type: IssueType!
    comment: String
    product: Product!
  }

  type Query {
    issues: [Issue]
  }

  type Mutation {
    createIssue(type: IssueType!, comment: String, productId: ID!): Issue
  }
`;

const resolvers = {
  Query: {
    issues: () => {
      logger.info('Get all issues');
      return getIssues()
    },
  },
  Mutation: {
    createIssue: (_: any, { type, comment, productId }: CreateIssue) => {
      logger.info('Create issue');
      logger.debug({ type, comment, productId })
      return createIssue(type, comment, productId)
    },
  },
};

setupDB()

// Create a new ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
server.listen().then(({ url }) => {
  logger.info(`Server ready at ${url}`);
});
