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