const Permission = require('./permission.model');

const createPermission = async(parent, {input})=>{
    if(!input){
        throw new Error('No data input');
    }else{
        const {role, access} = input;
        const data = new Permission({
            role : role,
            access : access
        });
        await data.save();
        return data
    }
}

const getAllPermission = async(parent, args, ctx)=>{
    const result = await Permission.find();
    return result;
}
const updatePermission = ()=>{}
const deletePermission = ()=>{}

const PermissionResolvers = {
    Query : {
        getAllPermission
    },

    Mutation : {
        createPermission,
        updatePermission,
        deletePermission
    }
}

module.exports = {PermissionResolvers};