const {
    getAllBooks,
    getAllShelf, 
    insertBook,
    updateTitleBook,
    deleteBook,
    paginationBook
} = require('../Controller/function');


const resolvers = {
    Query : {
        getAllBooks,
        getAllShelf,
        paginationBook
    },

    Mutation : {
        insertBook,
        updateTitleBook,
        deleteBook
    }
}

module.exports = {resolvers}