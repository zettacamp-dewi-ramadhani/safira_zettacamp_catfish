const Recipe = require('./recipe.model');
const Ingredient = require('../Ingredient/ingredient.model')

async function getAvailable({ ingredients }, args, context, info) {
    const minStock = []
    for (let ingredient of ingredients) {
        const recipe_ingredient = await Ingredient.findById(ingredient.ingredient_id);
        if (!recipe_ingredient) throw new ApolloError(`Ingredient with ID: ${ingredient.ingredient_id} not found`, "404");
        minStock.push(Math.floor(recipe_ingredient.stock / ingredient.stock_used));
    }
    return Math.min(...minStock);
}

// const validateIngredient = async(ingredients)=>{
//     let available = []
//     for(const data of ingredients){
//         ingredientData = Ingredient.findOne({
//             _id : data.ingredient_id
//         })
//         if(ingredientData.status == 'deleted'){
//             available.push(true)
//         }else{
//             available.push(false)
//         }
//     }

//     const temp = available.includes(true);
    
//     if(temp === true){
//         return true;
        
//     }else{
//         return false;
//     }
// }

const createRecipe = async(parent, {input})=>{
    if(!input){
        throw new Error('No input data');
    }else{
        const {recipe_name, ingredients, price, image} = input;    
        // const validate = await validateIngredient(ingredients);
        // if(validate == false){
        //     throw new Error('Ingredient is deleted');
        // }else{}
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
        const {id, newName, newIngredient, image, status} = input;
        let data = await Recipe.findByIdAndUpdate({
            _id : id
        },{
            $set : {
                recipe_name : newName,
                ingredients : newIngredient,
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
        console.log('No Input Data')
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