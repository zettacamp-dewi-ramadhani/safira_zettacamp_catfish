const Transaction = require('./transaction.model');
const Ingredient = require('../Ingredient/ingredient.model');
const Recipe = require('../Recipe/recipe.model');
const moment = require('moment');
const mongoose = require('mongoose');

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

const updateMenu = async(id, menu)=>{
    let totalPrice = await getTotalPrice(menu);
    const addMenu = await Transaction.findByIdAndUpdate({
        _id : id
    },{
        $push : {
            menu : menu
        }
    },{
        new : true
    });
    if(addMenu){
        const updateTotal = await Transaction.findByIdAndUpdate({
            _id : id
        },{
            $inc : {
                total : totalPrice
            }
        },{
            new : true
        });
        return updateTotal
    }
}

const createTransaction = async(id, menu)=>{
    let totalPrice = await getTotalPrice(menu);
    if(id && menu){
        let data = new Transaction({
            user_id : id,
            menu : menu,
            total : totalPrice,
            order_status : 'pending'
        });
        await data.save();
        return data;
    }else{
        throw new Error('Cant create new transaction');
    }
}

const addCart = async(parent, {input}, ctx)=>{
    const userId = ctx.user[0]._id;
    const data = await Transaction.findOne({
        user_id : mongoose.Types.ObjectId(userId)
    });
    if(!input){
        throw new Error('No data to input');
    }else{
        const {menu} = input
        if(data == null){
            const create = await createTransaction(userId, menu);
            return create
        }else{
            const update = await updateMenu(data._id, menu);
            return update
        }
    }
}

const deleteMenu = async(parent, {input}, ctx)=>{
    if(!input){
        throw new Error('No menu to dalete');
    }else{
        const userId = ctx.user[0]._id;
        const data = await Transaction.findOne({
            user_id : mongoose.Types.ObjectId(userId)
        });
        if(data){
            const {menu} = input
            let totalPrice = await getTotalPrice(menu);
            const deleteMenu = await Transaction.findByIdAndUpdate({
                _id : data._id
            },{
                $pull : {
                    menu : {
                        $in : [menu]
                    }
                }
            },{
                new : true
            });
            if(deleteMenu){
                const updateTotal = await Transaction.findByIdAndUpdate({
                    _id : data._id
                },{
                    $inc : {
                        total : -totalPrice
                    }
                },{
                    new : true
                });
                return updateTotal
            }
        }
    }
}

const getAllTransactions = async(parent, {filter, pagination}, ctx)=>{
    let aggregateQuery = [];
    let matchQuerry = {
        $and : [],
    }
    
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
    
        if(filter.order_status){
            const search = new RegExp(filter.order_status, 'i');
            matchQuerry.$and.push({
                status : 'active',
                order_status : search
            })
        }
    
        if(filter.order_date){
            const search = new RegExp(filter.order_date, 'i');
            matchQuerry.$and.push({
                status : 'active',
                order_date : search
            });
        }
    }
    
    if(matchQuerry.$and.length){
        aggregateQuery.push({
          $match: matchQuerry
        })
    }
    
    if(pagination){
        const {limit, page} = pagination;
        aggregateQuery.push({
            $skip : page*limit
        },{
            $limit : limit
        })
    }
    
    if(!aggregateQuery.length){
        return await Transaction.find()
    }
        
    let result = [];
    
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
        addCart,
        deleteTransaction,
        deleteMenu
    },

    Transactions : {
        user_id : getUserLoader
    },

    Detail_Menu : {
        recipe_id : getMenuLoader
    }
};

module.exports = {TransactionResolvers}