const jwt = require('jsonwebtoken');
const tokenSecret = 'secret';
const User = require('../Model/user.model');

// const signUp = async(parent, {input: {username, password}})=>{
//     let user = new User({
//         username : username,
//         password : password
//     });
//     await user.save();
//     return {
//         _id : user._id,
//         username : user.username
//     };
// }

// const login = async(parent, {input: {username, password}})=>{
//     let user = await User.find({
//         username : {
//             $eq : username
//         }
//     });
//     const token = jwt.sign({
//         userId : user[0]._id
//     }, tokenSecret);
//     return {
//         token,
//         user : {
//             _id : user[0]._id,
//             username : user[0].username
//         }
//     }
// }

const authJwt = async(resolver, parent, args, ctx)=>{
    const auth = ctx.req.get('Authorization').replace("Bearer ", "");
    // console.log(auth);

    if(!auth){
        return {
            message : "Unauthorization"
        }
    }else{
        // const access = token.split(' ')[1];
        const ver = jwt.verify(auth, tokenSecret);
        console.log(ver)
        const getUser = await User.find({
            _id : ver.userId
        });
        ctx.user = getUser;
        console.log(getUser)
        ctx.token = auth
    }
    return resolver();
}

module.exports = {
    Query :{
        getAllUsers : authJwt,
        getAllSongs : authJwt,
        getAllPlaylist : authJwt
    },

    Mutation : {
        insertSong : authJwt,
        updateDurationSong : authJwt,
        deleteSong : authJwt,
        insertPlaylist : authJwt,
        deletePlaylist : authJwt
    },
}
// module.exports = {
//     Query :{
//         getAllSongs : authJwt
//     }
// }