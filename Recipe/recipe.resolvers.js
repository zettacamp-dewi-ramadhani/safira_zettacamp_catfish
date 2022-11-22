const Recipe = require('./recipe.model');
const Ingredient = require('../Ingredient/ingredient.model');
const { Error } = require('mongoose');

async function getAvailable({ ingredients }, args, context, info) {

  const minStock = []
  for (let ingredient of ingredients) {
      const recipe_ingredient = await Ingredient.findById(ingredient.ingredient_id);
      if (!recipe_ingredient) throw new Error(`Ingredient with ID: ${ingredient.ingredient_id} not found`, "404");
      minStock.push(Math.floor(recipe_ingredient.stock / ingredient.stock_used));
  }
  let minus = minStock.some(v=> v<0);
  if(minus == true){
    let result = 0;
    return result
  }else{
    let result = Math.min(...minStock);
    return result;
  }
}

const validateIngredient = async(ingredients)=>{
    let available = []
    for(const data of ingredients){
        ingredientData = await Ingredient.findOne({
            _id : data.ingredient_id
        })
        if(ingredientData.status == 'deleted'){
            available.push(false)
        }else{
            available.push(true)
        }
    }

    const temp = available.includes(true);
    
    if(temp === true){
        return true;
        
    }else{
        return false;
    }
}

const createRecipe = async(parent, {input})=>{
    if(!input){
        throw new Error('No input data');
    }else{
        const {recipe_name, ingredients, price, image} = input;    
        const validate = await validateIngredient(ingredients);
        if(validate == false){
            throw new Error('Ingredient is deleted');
        }else{}
        let data = new Recipe({
            recipe_name : recipe_name,
            ingredients : ingredients,
            price : price,
            image: image,
        });
        await data.save();
        return data;
    }
}

const getAllRecipes = async(parent, {filter, paging, status})=>{
 
  let aggregateQuery = [];

  let matchQuerry = {
    $and : [],
  }

  if(filter){
    if(filter.recipe_name){
      const search = new RegExp(filter.recipe_name, 'i');
      matchQuerry.$and.push({
        recipe_name : search,
      })
    }
  
    if(filter.price){
      matchQuerry.$and.push({
        price : filter.price,
      })
    }
  }

  if(matchQuerry.$and.length){
    aggregateQuery.push({
      $match: matchQuerry
    })
  }

  if(status){
    aggregateQuery.push({
      $match : {
        status : status
      }
    })
  }

  if(paging){
    const {limit, page} = paging;
    aggregateQuery.push({
      $skip : page*limit
    },{
      $limit : limit
    })
  }

  let totalCount = await Recipe.find().lean();

  if(!aggregateQuery.length){
    let result = await Recipe.find().lean()
    result = result.map((el)=>{
      return {...el, count_result : result.length, total_count : totalCount.length}
    })
    return result
  }

  let result = await Recipe.aggregate(aggregateQuery)
    result = result.map((el)=>{
          return {
            ...el,
            count_result: result.length,
            total_count: totalCount.length
          }
    })
  return result
}

const getRecipeLoader = async(parent, args, ctx)=>{
  if(parent.ingredient_id){
    const result = await ctx.recipeLoader.load(parent.ingredient_id);
    return result;
  }
}
const getOneRecipe = async(parent, {filter})=>{
  if(!filter){
    throw new Error('No data match')
  }else{
    const {id} = filter;
    let result = await Recipe.findOne({
      _id : id
    });
    return result;
  }
}
const updateRecipe = async(parent, {input})=>{

  if(!input){
    throw new Error('No data');
  }else{
    const {id, newName, newIngredient, price, image, status} = input;
    let data = await Recipe.findByIdAndUpdate({
      _id : id
    },{
      $set : {
        recipe_name : newName,
        ingredients : newIngredient,
        price : price,
        image : image,
        status: status
      }
    },{
      new : true
    });
    return data;
  }
}
const deleteRecipe = async(parent, {input})=>{
  if(!input){
    throw new Error('No Input Data')
  }else{
    const {id} = input
    let result = await Recipe.findByIdAndUpdate({
      _id : id
    },{
      $set : {
        status : 'deleted'
      }
    },{
      new : true
    });
    return result;
  }
}
const RecipeResolvers = {
  Query : {
    getAllRecipes,
    getOneRecipe
  },
  Mutation : {
    createRecipe,
    updateRecipe,
    deleteRecipe
  },
  Ingredient_Detail : {
    ingredient_id : getRecipeLoader
  },
  Recipes: {
      available : getAvailable
  }
}

module.exports = {RecipeResolvers}