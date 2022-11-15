const User = require('../User/user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp';
// const {AuthenticationError} = require('apollo-server-express');
const {ApolloError} = require('apollo-server-express');

const authJwt = async(resolver,parent, args, ctx,info)=>{
    const auth = ctx.req.get('Authorization');
    if(!auth){
        throw new ApolloError('Unauthorized');
    }else{
        const token = auth.replace("Bearer ", "")
        const verify = jwt.verify(token, tokenSecret);
        const getUser = await User.find({
            _id : verify.userId
        });
        ctx.user = getUser;
        ctx.token = auth
    }
    return resolver();
}

module.exports ={
    Query : {
        getAllUsers : authJwt,
        getOneUser : authJwt,
        getAllIngredients : authJwt,
        getOneIngredient : authJwt,
        // getAllRecipes : authJwt,
        // getOneRecipe : authJwt,
        getAllTransactions : authJwt,
        getOneTransactions : authJwt
    },

    Mutation : {
        updateUser : authJwt,
        deleteUser : authJwt,
        insertIngredient : authJwt,
        updateIngredient : authJwt,
        deleteIngredient : authJwt,
        createRecipe : authJwt,
        updateRecipe : authJwt,
        deleteRecipe : authJwt,
        createTransaction : authJwt,
        deleteTransaction : authJwt
    }
}