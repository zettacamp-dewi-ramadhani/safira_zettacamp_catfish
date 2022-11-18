const Transaction = require('./transaction.model');
const Ingredient = require('../Ingredient/ingredient.model');
const Recipe = require('../Recipe/recipe.model');
const moment = require('moment');

moment.locale('id-ID');

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
            if(ingredientData.available >= (ingredient.stock_used*recipe.amount)){
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

const getTotalPrice = async(menu)=>{
    let total = [];
    let totalPrice = []
    for(recipe of menu){
        recipeData = await Recipe.findOne({
            _id : recipe.recipe_id
        });
        total.push(recipe.amount * recipeData.price);
        totalPrice = total.reduce((a,b)=>a+b);
    }
    return totalPrice;
}

const createTransaction = async(parent,{input},ctx)=>{
    if(!input){
        throw new Error('Fill the input form to add data');
    }else{
        const userId = ctx.user[0]._id;
        const {menu} = input;
        let validate = await validateStockIngredient(menu);
        console.log(validate);
        // let totalPrice = await getTotalPrice(menu);
        // if(validate === true){
        //     let data = new Transaction({
        //         user_id : userId,
        //         menu : menu,
        //         total : totalPrice,
        //         order_status : 'success'
        //     });
        //     await data.save();
        //     return data;    
        // }else{
        //     let data = new Transaction({
        //         user_id : userId,
        //         menu : menu,
        //         total : totalPrice,
        //         order_status : 'failed'
        //     });
        //     await data.save();
        //     return data;
        // }
    }
}

const getAllTransactions = async(parent, {filter, pagination}, ctx)=>{
    let aggregateQuery = [];
    let result = [];

    if(filter){
        if(filter.user_lname || filter.recipe_name){
            if(filter.user_lname){
                const search = new RegExp(filter.user_lname, 'i');
                aggregateQuery.push({
                    $lookup : {
                        from : 'users',
                        localField : 'user_id',
                        foreignField : '_id',
                        as : 'user_detail'
                    }
                },{
                    $match :{
                        'user_detail.last_name' : search
                    }
                })
            }

            if(filter.recipe_name){
                const search = new RegExp(filter.recipe_name, 'i');
                aggregateQuery.push({
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
                }) 
            }
        }

        let indexMatch = aggregateQuery.push({
            $match : {
                $and : []
            }
        }) - 1;

        if(filter.order_status){
            const search = new RegExp(filter.order_status, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                status : 'active',
                order_status : search
            })
        }

        if(filter.order_date){
            const search = new RegExp(filter.order_date, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                status : 'active',
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

    filter || pagination ? result = await Transaction.aggregate(aggregateQuery) : result = await Transaction.find().toArray();
    return result;
}

const getOneTransactions = async(parent, {filter})=>{
    if(!filter){
        throw new Error('Nothing to find');
    }else{
        const {id} = filter;
        let result = await Transaction.findOne({
            _id : id
        });
        return result;
    }
}

const deleteTransaction = async(parent, {input})=>{
    if(!input){
        throw new Error('Nothing to delete');
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