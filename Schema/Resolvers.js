const {getAllBooks, getAllShelf} = require('../Controller/function');
const Book = require('../Model/bookModel');

const resolvers = {
    Query : {
        getAllBooks,
        getAllShelf
    },

    Mutation : {
        insertBook: async(parent, {input: {title,author,date_published,price}})=>{
            let data = new Book({
                title : title,
                author : author,
                date_published : date_published,
                price : price,
                created : new Date().toISOString(),
                updated : new Date().toISOString()
            });
            const res = await data.save();
            return "ok";
        }
    }
}

module.exports = {resolvers}