const User = require('../User/user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp';
// const {AuthenticationError} = require('apollo-server-express');
const {ApolloError} = require('apollo-server-express');

const authJwt = async(resolver,parent, args, ctx,info)=>{
    // const auth = ctx.req.get('Authorization').replace("Bearer ", "");
    console.log(ctx.req.headers.authorization)
    const auth = ctx.req.headers.authorization || ""
    console.log(auth)
    if(!auth){
        console.log('Hey')
        throw new Error('error brooo')
        // return console.log("Unauthorization");
        throw new ApolloError('foobor', {message: 'Unathorized'})
    }else{
        console.log("lanjut")
        const token = auth.replace("Bearer ", "")
        const verify = jwt.verify(token, tokenSecret);
        const getUser = await User.find({
            _id : verify.userId
        });
        ctx.user = getUser;
        ctx.token = auth
        return resolver(parent, args, ctx, info)
    }
    console.log('tess')
}

module.exports ={
    Query : {
        getAllUsers : authJwt,
        getOneUser : authJwt,
        getAllIngredients : authJwt,
        getOneIngredient : authJwt
    },

    Mutation : {
        updateUser : authJwt,
        deleteUser : authJwt,
        insertIngredient : authJwt,
        updateIngredient : authJwt,
        deleteIngredient : authJwt
    }
}