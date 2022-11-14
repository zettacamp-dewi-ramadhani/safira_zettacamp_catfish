const {gql} = require('apollo-server-express');

const TransactionTypeDefs = gql`
    # scalar Date

    type Transactions {
        _id : ID,
        user_id : Users,
        menu : [Detail_Menu],
        order_status : Order,
        order_date : String,
        status : Status
    }

    type Detail_Menu {
        recipe_id : Recipes,
        amount : Int,
        note : String
    }

    enum Order {
        success,
        failed
    }

    enum Status {
        active,
        deleted
    }

    input DataDelete {
        id : ID,
        status : Status
    }

    input DataInput {
        menu : [Detail],
        order_status : Order
    }

    input Detail {
        recipe_id : ID,
        amount : Int,
        note : String
    }

    input DataFilter {
        user_lname : String,
        recipe_name : String,
        order_status : Order,
        order_date : String
    }

    input OneDataFilter {
        id : ID
    }

    input Paging {
        page : Int,
        limit : Int
    }

    type Query {
        getAllTransactions(filter_transaction : DataFilter, pagination : Paging) : [Transactions],
        getOneTransactions(filter_transaction : OneDataFilter) : Transactions
    }

    type Mutation {
        createTransaction(input : DataInput) : Transactions,
        deleteTransaction(input : DataDelete) : Transactions
    }
`

module.exports = {TransactionTypeDefs}