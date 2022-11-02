const Book = require('../Model/bookModel');
const Shelf = require('../Model/shelfModel');

const resolvers = {
    Query : {
        async getAllBooks(){
            let result = await Book.find();
            return result;
        },

        async getAllShelf(){
            let result =  await Shelf.find();
            return result;
        }
         
    }
}

module.exports = {resolvers}