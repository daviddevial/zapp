# Zapp

Backend application for managing delivery issues

## Overview

The application consists of a Node.js server using TypeScript. It uses Apollo Server for the GraphQL API and SQLite for the database to persist issues reported by customers. The database is in memory only for faster changes during development. The issues and products table are inserted when the service starts alongside dummy data to allow the service to work.

## Assumptions

- Authentication and authorization are out of scope.
- SQLite would be swapped out for a more robust database like PostgreSQL in production.
- Products already exist and are created by other endpoints.
- Logging level would likely be set to info or higher in production.

## Run locally

After installing dependencies included in the package.json file using `npm i`, this application can be run locally with the following command `npx ts-node src/app.ts`. Visiting http://localhost:4000/ when the service is running provides a link to the Apollo Studio query console for easy querying.

## Sample requests

### Mutating to create issue

```
mutation Mutation($type: IssueType!, $productId: ID!, $comment: String) {
  createIssue(type: $type, productId: $productId, comment: $comment) {
    id
    comment
    type
    product {
      id
      name
      imageUrl
    }
  }
}
```

```
{
  "type": "DAMAGE",
  "productId": "1",
  "comment": "My free text issue description"
}
```

### Querying for all issues

```
query ExampleQuery {
  issues {
    id
    comment
    type
    product {
      id
      name
      imageUrl
    }
  }
}
```

## Setup and deployment to Cloud Environment

For deployment, I would use a containerized approach with Docker and Kubernetes for orchestration. This allows for scalability and easy updates. Services such as AWS, GCP or Azure can be used to host the Kubernetes cluster. I would setup a CI/CD pipeline using for example GitLab pipelines to connect my Git source control for the project repository to the cloud environment. Some changes would be required to point to a real database instance.
