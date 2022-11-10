const Transaction = require('./transaction.model');

const reduceIngredientStock = ()=>{}

const validateStockIngrediet = ()=>{}

const getUserLoader = ()=>{}

const getIngredientLoader = ()=>{}

const createTransaction = ()=>{}

const getAllTransactions = ()=>{}

const getOneTransactions = ()=>{}

const deleteTransaction = ()=>{}

const TransactionResolvers = {
    Query : {
        getAllTransactions,
        getOneTransactions
    },

    Mutation : {
        createTransaction,
        deleteTransaction
    },

    Transactions : {
        user_id : getUserLoader
    }
};

module.exports = {TransactionResolvers}