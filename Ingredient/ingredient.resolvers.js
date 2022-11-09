const Ingredient = require('./ingredient.model');

const getAllIngredients = async(parent, {filter})=>{

}
const getOneIngredient = ()=>{}
const insertIngredient = ()=>{}
const updateIngredient = ()=>{}
const deleteIngredient = ()=>{}

const IngredientResolvers = {
    Query : {
        getAllIngredients,
        getOneIngredient
    },

    Mutation : {
        insertIngredient,
        updateIngredient,
        deleteIngredient
    }
}

module.exports =  {IngredientResolvers}