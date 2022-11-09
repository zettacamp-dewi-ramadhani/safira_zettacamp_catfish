const User = require('../User/user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp'

const authJwt = async(resolver,parent, args, ctx)=>{
    const auth = ctx.req.get('Authorization').replace("Bearer ", "");
    
    if(!auth){
        return console.log("Unauthorization");
    }else{
        const verify = jwt.verify(auth, tokenSecret);
        const getUser = await User.find({
            _id : verify.userId
        });
        ctx.user = getUser;
        ctx.token = auth
    }
    return resolver()
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