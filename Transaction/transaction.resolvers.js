const Transaction = require('./transaction.model');
const Ingredient = require('../Ingredient/ingredient.model');
const Recipe = require('../Recipe/recipe.model');
const {GraphQLScalarType, Kind} = require('graphql');
const moment = require('moment');

const dateScalar = new GraphQLScalarType({
    name : 'Date',
    description : 'Custom date scalar type',
    serialize(value){
        return value.getTime()
    },
    parseValue(value){
        return new Date(value);
    },
    parseLiteral(ast){
        if (ast.kind === Kind.INT){
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    }
});

const reduceIngredientStock  = async (menu)=>{
    for(const recipe of menu){
        recipeData = await Recipe.findOne({
            _id : recipe.recipe_id
        });
        for(const ingredient of recipeData.ingredients){
            const amountData = ingredient.stock_used*recipe.amount;
            ingredientData = await Ingredient.updateOne({
                _id : ingredient.ingredient_id
            },{
                $inc : {
                    stock : - amountData
                }
            });
        }
    }
    return true;
}

const validateStockIngredient = async(menu)=>{
    let recipeData = [];
    let ingredientData = [];
    let available = []
    for(const recipe of menu){
        recipeData = await Recipe.findOne({
            _id : recipe.recipe_id
        });
        for(const ingredient of recipeData.ingredients){
            ingredientData = await Ingredient.findOne({
                _id : ingredient.ingredient_id
            });
            if(ingredientData.stock >= (ingredient.stock_used*recipe.amount)){
                available.push(true)
            }else{
                available.push(false)
            }
        }
    }
    const temp = available.includes(false);
    if(temp === false){
        await reduceIngredientStock(menu);
        return true;
        
    }else{
        return false;
    }
}

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
        const {menu, order_date} = input;
        let validate = await validateStockIngredient(menu);
        if(validate === true){
            let data = new Transaction({
                user_id : userId,
                menu : menu,
                order_date : 'success',
                order_date : order_date
            });
            await data.save();
            return data;    
        }else{
            let data = new Transaction({
                user_id : userId,
                menu : menu,
                order_status : 'failed',
                order_date : order_date
            });
            await data.save();
            return data;
        }
    }
}

const getAllTransactions = async(parent, {filter_transaction, pagination}, ctx)=>{
    let aggregateQuery = [];
    let result = [];

    
    if(filter_transaction.user_lname){
        const search = new RegExp(filter_transaction.user_lname, 'i');
        result = await Transaction.aggregate([{
            $lookup : {
                from : 'users',
                localField : 'user_id',
                foreignField : '_id',
                as : 'user_detail'
            }
        },{
            $match : {
                "user_detail.last_name" : search
            }
        }]);
    };

    if(filter_transaction.recipe_name){
        const search = new RegExp(filter_transaction.recipe_name, 'i');
            result = await Transaction.aggregate([{
                $lookup : {
                    from : 'recipes',
                    localField : 'menu.recipe_id',
                    foreignField : '_id',
                    as : 'recipe_detail'
                }
            },{
                $match : {
                    "recipe_detail.recipe_name" : search
                }
            }])
        }

    if(filter_transaction){
        let indexMatch = aggregateQuery.push({
            $match : {
                $and : []
            }
        }) - 1;

        if(filter_transaction.order_status){
            const search = new RegExp(filter_transaction.order_status, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                order_status : search
            })
        }

        if(filter_transaction.order_date){
            const search = new RegExp(filter_transaction.order_date, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                order_date : search
            });
        }
    }

    if(pagination){
        const {limit, page} = pagination;
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

    filter_transaction || pagination ? result = await Transaction.aggregate(aggregateQuery) : result = await Transaction.find().toArray()
    return result;
}

const getOneTransactions = async(parent, {filter_transaction})=>{
    if(!filter_transaction){
        console.log('No data match');
    }else{
        const {id} = filter_transaction;
        let result = await Transaction.findOne({
            _id : id
        });
        return result;
    }
}

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
    // Date : dateScalar,

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