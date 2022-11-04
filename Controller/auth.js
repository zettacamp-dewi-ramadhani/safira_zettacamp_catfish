const jwt = require('jsonwebtoken');
const users = [{
    id : 1,
    username : 'safira',
    password : 'zetta'
}];

const authUser = async (resolver, parent, args, ctx)=>{
    const token = ctx.req.header('Authorization');

    if(!token){
        throw new Error("Token is required");
    }else{
        const access = token.split(' ')[1];
        const ver = jwt.verify(access, "fira");
        const user = users.find(({id})=>id===ver.id);
        ctx.users = user;
    }
    return resolver()
}

module.exports = authUser