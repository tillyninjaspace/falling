const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP
const graphql = require('graphql');
const CONNECTION_STRING = process.env.DATABASE_URL || 'postgres://localhost:5432/falling'

const pgp = require('pg-promise')();
const db = {}
db.conn = pgp(CONNECTION_STRING);

const {PORT} = process.env
app = express();

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLList,
    GraphQLSchema
 } = graphql;
 const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
       id: { type: GraphQLID },
       firstname: { type: GraphQLString },
       lastname: { type: GraphQLString },
       emails: {
          type: new GraphQLList(EmailType),
          resolve(parentValue, args) {
             const query = `SELECT * FROM "emails" WHERE
             person=${parentValue.id}`;
             return db.conn.many(query)
                .then(data => {
                   return data;
                })
                .catch(err => {
                   return 'The error is', err;
                });
          }
       }
    })
 })
 const EmailType = new GraphQLObjectType({
    name: 'Email',
    fields: {
       id: { type: GraphQLID },
       email: { type: GraphQLString },
       primary: { type: GraphQLBoolean }
    }
 })
 const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
       person: {
       type: PersonType,
       args: { id: { type: GraphQLID } },
       resolve(parentValue, args) {
          const query = `SELECT * FROM "people" WHERE id=${args.id}`;
          return db.conn.one(query)
             .then(data => {
                return data;
             })
             .catch(err => {
                 return 'The error is', err;
             });
       }
    },
    emails: {
       type: EmailType,
       args: { id: { type: GraphQLID } },
       resolve(parentValue, args) {
          const query = `SELECT * FROM "emails" WHERE id=${args.id}`;
          return db.conn.one(query)
             .then(data => {
                return data;
             })
             .catch(err => {
                return 'The error is', err;
             });
         }
       }
    }
 })

 const schema = new GraphQLSchema({
    query: RootQuery
}); 

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`Yes. App Server is up on ${PORT}`);
});