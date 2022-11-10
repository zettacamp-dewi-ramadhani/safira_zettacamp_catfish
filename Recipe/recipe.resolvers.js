const Recipe = require('./recipe.model');

const createRecipe = async(parent, {input})=>{
    if(!input){
        console.log('Nothing to input')
    }else{
        const {recipe_name, ingredients} = input;
        // console.log(ingredients);        
        let data = new Recipe({
            recipe_name : recipe_name,
            ingredients : ingredients
        });
        await data.save();
        console.log(data)
        return data;
    }
}
const getAllRecipes = async(parent, {filter})=>{
    if(!filter){
        console.log('Set the filter')
    }else{
        const {recipe_name, paging} = filter;
        if(!recipe_name){
            let result = await Recipe.aggregate([{
                $match :{
                    status : 'active'
                }
            },{
                $skip : paging.page * paging.limit
            },{
                $limit : paging.limit
            }]);
            console.log(result)
            return result;
        }else{
            let result = await Recipe.aggregate([{
                $match :{
                    status : 'active',
                    recipe_name : recipe_name
                }
            },{
                $skip : paging.page * paging.limit
            },{
                $limit : paging.limit
            }]);
            return result;
        }
    }
}
const getRecipeLoader = async(parent, args, ctx)=>{
    if(parent.ingredient_id){
        const result = await ctx.recipeLoader.load(parent.ingredient_id);
        return result;
    }
}
const getOneRecipe = ()=>{}
const updateRecipe = ()=>{}
const deleteRecipe = ()=>{}

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