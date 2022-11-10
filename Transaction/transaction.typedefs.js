const {gql} = require('apollo-server-express');

const TransactionTypeDefs = gql`
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

    type Query {
        getAllTransactions : [Transactions],
        getOneTransactions : Transactions
    }

    type Mutation {
        createTransaction : Transactions,
        deleteTransaction : Transactions
    }
`

module.exports = {TransactionTypeDefs}