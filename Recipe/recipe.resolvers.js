const Recipe = require('./recipe.model');

// const validateIngredient = async (id)=>{
//     for (const ingredient of id){}
// }

const createRecipe = async(parent, {input})=>{
  if(!input){
    console.log('Nothing to input')
  }else{
    const {recipe_name, ingredients, price} = input;  
    let data = new Recipe({
      recipe_name : recipe_name,
      ingredients : ingredients,
      price : price
    });
    await data.save();
    return data;
  }
}
const getAllRecipes = async(parent, {filter, paging})=>{
  let aggregateQuery = [];
  if(filter){
    let indexMatch = aggregateQuery.push({
      $match : {
        $and : []
      }
    }) - 1;
    
    if(filter.recipe_name){
      const search = new RegExp(filter.recipe_name, 'i');
      aggregateQuery[indexMatch].$match.$and.push({
        recipe_name : search,
        status : 'active'
      })
    }
    if(filter.price){
      aggregateQuery[indexMatch].$match.$and.push({
        price : filter.price,
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
  filter || paging ? result = await Recipe.aggregate(aggregateQuery) : result = await Recipe.find().toArray();
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
    console.log('No data match')
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
    console.log('No data');
  }else{
    const {id, newName, newIngredient} = input;
    let data = await Recipe.findByIdAndUpdate({
      _id : id
    },{
      $set : {
        recipe_name : newName,
        ingredients : newIngredient
      }
    },{
      new : true
    });
    return data;
  }
}
const deleteRecipe = async(parent, {input})=>{
  if(!input){
    console.log('No Input Data')
  }else{
    const {id, status} = input
    let result = await Recipe.findByIdAndUpdate({
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
  }
}

module.exports = {RecipeResolvers}