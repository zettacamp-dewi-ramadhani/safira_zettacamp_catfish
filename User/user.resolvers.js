const User = require('./user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp'

const signUp = async (parent, {input})=>{
    try{
        if(!input){
            throw new Error('No data to input')
        }else{
            const {email, password, first_name, last_name, role} = input
            let user = new User({
                email : email,
                password : password,
                first_name : first_name,
                last_name : last_name,
                role : role
            });
    
            await user.save();
            return {
                _id : user._id,
                email : user.email,
                first_name : user.first_name,
                last_name : user.last_name,
                role : user.role,
                status : user.status
            }
        }
    }catch(err){
        throw new Error('Sign Up Error : ${err.message}')
    }
}

const login = async (parent, {input : {email, password}})=>{
    let user = await User.findOne({
        email : email,
        password : password
    });
    if(!user){
        throw new Error('Login Error');
    }else if(user.status === "deleted"){
        throw new Error('User not found');
    }else{
        const token = jwt.sign({
            id : user._id,
            email : user.email,
            role : user.role
        },tokenSecret,{
            expiresIn : '1h'
        });
        return {
            token,
            user : {
                _id : user._id,
                email : user.email
            }
        }
    }
}

const getAllUsers = async(parent,{filter})=>{
    const {email, first_name, last_name, paging} = filter;
    if(!email && !first_name && !last_name){
        let result = await User.aggregate([{
            $match : {
                status : 'active'
            }
        },{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }]);
        return result;
    }else{
        let result = await User.aggregate([{
            $match : {
                status : 'active'
            }
        },{
            $in : {
                email : email,
                first_name : first_name,
                last_name : last_name
            }
        },{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }])
        return result;
    }
}

const getOneUser = async(parent, {filter})=>{
    const {id, email} = filter;
     if(!id){
        let result = await User.findOne({
            email : email
        });
        return result;
    }else if(!email){
        let result = await User.findOne({
            _id : id
        });
        return result;
    }else{
        let result = await User.findOne({
            _id : id,
            email : email
        });
        return result;
    }
}

const updateUser = async(parent, {input}, ctx)=>{
    if(!input){
        return console.log("Nothing to Update");
    }else{
        const {
            newEmail,
            newPassword,
            newFirst_name,
            newLast_name
        } = input;
        const userId = ctx.user[0]._id
        let data = await User.findByIdAndUpdate(userId,{
            email : newEmail,
            password : newPassword,
            first_name : newFirst_name,
            last_name : newLast_name
        },{
            new : true
        });
        return data
    }
}

const deleteUser = async(parent,{input}, ctx)=>{
    if(!input){
        console.log("Nothing to update");
    }else{
        const {id, status} = input;
        let result = await User.findByIdAndUpdate({
            _id : id
        },{
            $set : {
                status : status
            }
        },{
            new : true
        });
        return result;
    }
}

const UserResolvers = {
    Query : {
        getAllUsers,
        getOneUser
    },

    Mutation : {
        signUp,
        login,
        updateUser,
        deleteUser
    }
}

module.exports = {UserResolvers}