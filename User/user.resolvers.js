const User = require('./user.model');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secretZettaCamp';
const bcrypt = require('bcrypt');

const signUp = async (parent, {input})=>{
    try{
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
                view : false
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
    }catch(err){
        throw new Error('Sign Up Error')
    }
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
            expiresIn : '12h'
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

const getAllUsers = async(parent,{filter,paging})=>{
    let aggregateQuery = [];
    if(filter){
        let indexMatch = aggregateQuery.push({
            $match : {
                $and : []
            }
        }) - 1;
        
        if(filter.email){
            const search = new RegExp(filter.email, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                email : search,
                status : 'active'
            })
        }

        if(filter.first_name){
            const search = new RegExp(filter.first_name, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                first_name : search,
                status : 'active'
            })
        }

        if(filter.last_name){
            const search = new RegExp(filter.last_name, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                last_name : search,
                status : 'active'
            })
        }
    }
    if(paging){
        const {limit, page} = paging;
        aggregateQuery.push({
            $match : {
                status : 'active'
            }
        },{
            $skip : page*limit
        },{
            $limit : limit
        })
    }

    let result = [];
    filter || paging ? result = await User.aggregate(aggregateQuery) : result = await User.find().toArray();
    return result
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
        throw new Error('No data to update');
    }else{
        const {
            newEmail,
            newPassword,
            newFirst_name,
            newLast_name
        } = input;
        const userId = ctx.user[0]._id;
        const encryptedPass = await bcrypt.hash(newPassword, 10);
        let data = await User.findByIdAndUpdate(userId,{
            email : newEmail,
            password : encryptedPass,
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
        throw new Error("Nothing to update")
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