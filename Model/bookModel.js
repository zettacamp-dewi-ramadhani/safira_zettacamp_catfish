const {db, mongoose} = require('../db');

const bookSchema = new mongoose.Schema({
    title : {type: String},
    author : {type: String},
    date_published : {type: String},
    price : {type: Number},
    created : {type: Date, default : Date.now},
    updated : {type: Date, default : Date.now}
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;