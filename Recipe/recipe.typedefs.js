const {gql} = require('apollo-server-express');

const RecipeTypeDefs = gql`
    type Recipes {
        _id : ID,
        recipe_name : String,
        ingredients : [Ingredient_Detail],
        price : Int,
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

    input DataFilterForRecipe {
        recipe_name : String,
        price : Int
    }

    input DetailIngredientForRecipe {
        ingredient_id : ID,
        stock_used : Int
    }
    
    input DataInputRecipe {
        recipe_name : String,
        ingredients : [DetailIngredientForRecipe]
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
        getAllRecipes(filter : DataFilterForRecipe, paging : Paging) : [Recipes],
        getOneRecipe(filter : OneDataFilter) : Recipes
    }

    type Mutation {
        createRecipe(input : DataInputRecipe) : Recipes,
        updateRecipe(input : DataUpdate) : Recipes,
        deleteRecipe(input : DataDelete) : Recipes
    }
`

module.exports = {RecipeTypeDefs};