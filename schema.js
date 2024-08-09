const { gql } = require("apollo-server");
exports.typeDefs = gql`
  type Query {
    products(filter: ProductFilterInput): [Product!]!
    product(id: ID!): Product
    productByName(name: String!): Product
    categories: [Category!]!
    category(id: ID!): Category
    categoryByName(name: String!): Category
  }

  type Mutation {
    addNewCategory(input: AddCategoryInput!): Category!
    addNewProduct(input: AddProductInput!): Product!
    addNewProducts(input: [AddProductInput!]!): [Product!]!
    addNewReview(input: AddReviewInput!): Review!
    addNewUser(input: AddUserInput!): User!
    deleteCategory(id: ID!): Boolean!
    deleteProduct(id: ID!): Boolean!
    deleteReview(id: ID!): Boolean!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
  }
  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    category: Category
    reviews: [Review!]!
  }

  type Category {
    id: ID!
    name: String!
    products(filter: ProductFilterInput): [Product!]!
  }

  type Review {
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productID: ID!
  }

  type User {
    id: ID!
    username: String!
    password: String!
    role: String!
  }

  input ProductFilterInput {
    onSale: Boolean
  }

  input AddCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String!
  }

  input AddProductInput {
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    categoryId: String!
  }

  input AddReviewInput {
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productID: String!
  }

  input AddUserInput {
    username: String!
    password: String!
    role: String!
  }
`;
