const Transaction = require('./transaction.model');
const Ingredient = require('../Ingredient/ingredient.model');

const reduceIngredientStock = ()=>{}

const validateStockIngrediet = ()=>{}

const getUserLoader = async(parent, args, ctx)=>{
    if(parent.user_id){
        const result = await ctx.dataUserLoader.load(parent.user_id);
        return result;
    }
}

const getMenuLoader = async(parent, args, ctx)=>{
    if(parent.recipe_id){
        const result = await ctx.dataRecipeLoader.load(parent.recipe_id);
        return result;
    }
}

const createTransaction = async(parent,{input},ctx)=>{
    if(!input){
        console.log('Nothing to input')
    }else{
        const userId = ctx.user[0]._id;
        const {menu, order_status} = input;
        console.log(userId)
        if(!order_status){
            let data = new Transaction({
                user_id : userId,
                menu : menu
            });
            await data.save();
            return data;    
        }else{
            let data = new Transaction({
                user_id : userId,
                menu : menu,
                order_status : order_status
            });
            await data.save();
            return data;
        }
    }
}

const getAllTransactions = async(parent, {filter, pagination}, ctx)=>{
    console.log(filter);
    console.log(pagination);
}

const getOneTransactions = ()=>{}

const deleteTransaction = async(parent, {input})=>{
    if(!input){
        console.log('No Input Data')
    }else{
        const {id, status} = input
        let result = await Transaction.findByIdAndUpdate({
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

const TransactionResolvers = {
    Query : {
        getAllTransactions,
        getOneTransactions
    },

    Mutation : {
        createTransaction,
        deleteTransaction
    },

    Transactions : {
        user_id : getUserLoader
    },

    Detail_Menu : {
        recipe_id : getMenuLoader
    }
};

module.exports = {TransactionResolvers}