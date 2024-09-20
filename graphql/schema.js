const { buildSchema } = require('graphql');

//Root Query 는  GraphQL 스키마에서 클라이언트가 데이터를 요청할 수 있는 쿼리의 루트 타입을 정의하는 부분
module.exports = buildSchema(`
      type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        imageUrl: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts(page: Int): PostData!
        post(id: ID!): Post!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(postInput: PostInputData): Post!
        updatePost(id: ID!, postInput: PostInputData): Post!
        deletePost(id: ID!): Boolean
        updateStatus(status: String!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);