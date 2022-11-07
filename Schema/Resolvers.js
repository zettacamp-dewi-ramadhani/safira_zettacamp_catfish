const {
    getAllBooks,
    getAllShelf, 
    insertBook,
    updateTitleBook,
    deleteBook,
    paginationBook,
    getBooklistDataLoader
} = require('../Controller/function');

const {signUp} = require('../Controller/auth');


const resolvers = {
    Query : {
        getAllBooks,
        getAllShelf,
        paginationBook
    },

    Mutation : {
        signUp,
        insertBook,
        updateTitleBook,
        deleteBook
    },

    Detail_Shelf : {
        book_id : getBooklistDataLoader
    }
}

module.exports = {resolvers}