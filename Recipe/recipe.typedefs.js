const {gql} = require('apollo-server-express');

const RecipeTypeDefs = gql`
    type Recipes {
        _id : ID,
        recipe_name : String,
        ingredients : [Ingredient_Detail],
        status : Status
    }

    type Ingredient_Detail {
        ingredient_id : Ingredients,
        stock_used : Int
    }

    enum Status {
        active,
        deleted
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input DataFilter {
        recipe_name : String
    }

    input Detail {
        ingredient_id : ID,
        stock_used : Int
    }
    
    input DataInput {
        recipe_name : String,
        ingredients : [Detail]
        price : Int
    }

    input OneDataFilter{
        id : ID
    }

    input DataUpdate {
        id : ID,
        newName : String,
        newIngredient : [Detail]
    }

    input DataDelete{
        id : ID,
        status : Status
    }

    type Query {
        getAllRecipes(filter : DataFilter, paging : Paging) : [Recipes],
        getOneRecipe(filter : OneDataFilter) : Recipes
    }

    type Mutation {
        createRecipe(input : DataInput) : Recipes,
        updateRecipe(input : DataUpdate) : Recipes,
        deleteRecipe(input : DataDelete) : Recipes
    }
`

module.exports = {RecipeTypeDefs};