const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');
const secret = 'zetta'

const signUp = async (parent, {input: {username, password}})=>{
    let user = new User({
        username : username,
        password : password
    });
    await user.save();
    // return res;

    const token = jwt.sign({userId : user._id}, secret);
    console.log(token)
    return {
        token,
        user : {
            _id : user._id,
            username : user.username
        }
    }
}
// const users = [{
//     id : 1,
//     username : 'safira',
//     password : 'zetta'
// }];

const authJwt = async (resolver, parent, args, ctx)=>{
    const auth = ctx.req.header('Authorization');

    if(auth===undefined){
        return {message : "Unauthorized"}
    }else{
        const access = token.split(' ')[1];
        const ver = jwt.verify(access, secret);
        const user = await User.find({
            _id : {
                $in : ver._id
            }
        });
        // ctx.User = user;
        return resolver()
    }
}

module.exports = {signUp, authJwt}