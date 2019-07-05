const graphql = require('graphql');
const _ = require('lodash')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} = graphql;

var books = [
  { name: 'Livro 1', genre: 'Test', id: '1', authorId: '4'},
  { name: 'Livro 2', genre: 'Test', id: '2', authorId: '3'},
  { name: 'Livro 3', genre: 'Test', id: '3', authorId: '2'},
  { name: 'Livro 4', genre: 'Test', id: '4', authorId: '1'},
]

var authors = [
  { name: 'Matheus', age: 13, id: '1'},
  { name: 'Vand', age: 12, id: '2'},
  { name: 'Lucas', age: 43, id: '3'},
  { name: 'Vitor', age: 46, id: '4'},
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.find(books, { authorId: parent.id })
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, {id: args.id});
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, {id: args.id})
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
})