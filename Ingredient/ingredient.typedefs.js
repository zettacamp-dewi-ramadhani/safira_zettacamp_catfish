const {gql} = require('apollo-server-express');

const IngredientTypeDefs = gql`
    type Ingredients {
        _id : ID,
        name : String,
        stock : Int,
        status : Status
    }

    enum Status {
        active,
        deleted
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input DataFilter{
        name : String,
        stock : Int,
        paging : Paging
    }

    input OneDataFilter{
        id : ID
    }

    input DataInsert {
        name : String,
        stock : Int
    }

    input DataUpdate {
        id : ID,
        newStock : Int
    }

    input DataDelete{
        id : ID,
        status : Status
    }

    type Query {
        getAllIngredients(filter : DataFilter) : [Ingredients],
        getOneIngredient(filter : OneDataFilter) : Ingredients
    }

    type Mutation {
        insertIngredient(input : DataInsert) : Ingredients
        updateIngredient(input : DataUpdate) : Ingredients
        deleteIngredient(input : DataDelete) : Ingredients
    }
`

module.exports = {IngredientTypeDefs}