const User = require('./user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp';
const bcrypt = require('bcrypt');

const getTypeLoader = async(parent, args, ctx)=>{
    if(parent.type_id){
        const result = await ctx.userTypeLoader.load(parent.type_id);
        return result;
    }
}

const signUp = async (parent, {input})=>{
    // try{
        if(!input){
            throw new Error('No data to input')
        }else{
            const {email, password, first_name, last_name, role} = input
            const encryptedPass = await bcrypt.hash(password, 10);

            let generalPermit = [{
                name : "Menu",
                view : true
            },{
                name : "About",
                view : true
            },{
                name : "Cart",
                view : true
            },{
                name : "Login",
                view : false
            }]

            let usertype = [];
            if(role === 'admin'){
                usertype.push(
                    ...generalPermit,{
                        name : "Menu Management",
                        view : true
                    },{
                        name : "Stock Management",
                        view : true
                    }
                )
            }else if (role === 'user'){
                usertype.push(
                    ...generalPermit,{
                        name : "Menu Management",
                        view : false
                    },{
                        name : "Stock Management",
                        view : false
                    }
                )
            }

            let user = new User({
                email : email,
                password : encryptedPass,
                first_name : first_name,
                last_name : last_name,
                user_type : usertype
            });
    
            await user.save();
            return user;
        }
    // }catch(err){
    //     throw new Error('Sign Up Error')
    // }
}

const login = async (parent, {input : {email, password}})=>{
    let user = await User.findOne({
        email : email
    });

    const decryptedPass = await bcrypt.compare(password, user.password);
    if(user.status === "deleted"){
        throw new Error('Login Error');
    }else if(user && decryptedPass){
        const token = jwt.sign({
            id : user._id,
            email : user.email
        },tokenSecret,{
            expiresIn : '1h'
        });
        return {
            token,
            user : {
                _id : user._id,
                email : user.email,
                user_type : user.user_type
            }
        }
    }else{
        throw new Error('User not found');
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