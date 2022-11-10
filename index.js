const express = require('express');
const app = express();
const {gql, ApolloServer, ApolloError} = require('apollo-server-express');

const {merge} = require('lodash');
// const {makeExecutableSchema} = require('@graphql-tools/schema');
const {makeExecutableSchema} = require('graphql-tools');
const {applyMiddleware} = require('graphql-middleware');


const {UserTypeDefs} = require('./User/user.typedefs');
const {IngredientTypeDefs} = require('./Ingredient/ingredient.typedefs');
const {RecipeTypeDefs} = require('./Recipe/recipe.typedefs');
const {TransactionTypeDefs} = require('./Transaction/transaction.typedefs');

const {UserResolvers} = require('./User/user.resolvers');
const {IngredientResolvers} = require('./Ingredient/ingredient.resolvers');
const {RecipeResolvers} = require('./Recipe/recipe.resolvers');
const {TransactionResolvers} = require('./Transaction/transaction.resolvers');

const recipeLoader = require('./Recipe/recipe.loader');

const authJwt = require('./Controller/auth');

const typeDef = gql`
    type Query,
    type Mutation
`;

const typeDefs = [
    typeDef,
    UserTypeDefs,
    IngredientTypeDefs,
    RecipeTypeDefs,
    TransactionTypeDefs
]

const resolvers = merge(
    UserResolvers,
    IngredientResolvers,
    RecipeResolvers,
    TransactionResolvers
);

const auth = merge(authJwt);

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
})

const protectedSchema = applyMiddleware(executableSchema, auth);

const server = new ApolloServer({
    schema : protectedSchema,
    typeDefs,
    resolvers,
    context : function({
        req
    }){
        req;
        return{
            req,
            recipeLoader,
            ApolloError
        }
    }
})

server.start().then(res=>{
    server.applyMiddleware({app});
    app.listen(8000, ()=>console.log("Server Running on Port 8000"))
});