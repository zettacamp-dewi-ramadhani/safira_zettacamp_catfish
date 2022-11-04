const {
    getAllBooks,
    getAllShelf, 
    insertBook,
    updateTitleBook,
    deleteBook,
    paginationBook,
    getBooklistDataLoader
} = require('../Controller/function');
console.log(getBooklistDataLoader)


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
    },

    Detail_Shelf : {
        book_id : getBooklistDataLoader
    }
}

module.exports = {resolvers}