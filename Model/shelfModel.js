const {db, mongoose} = require('../db');

const shelfSchema = new mongoose.Schema({
        name : {type : String},
        book_ids : [{
            book_id : {
                type: mongoose.Schema.ObjectId,
                ref : 'books'
            },
            added_date : {type: Date, default : Date.now},
            stock : {type: Number}
        }],
        datetime : [{
            date : {type: String},
            time : {type: String}
        }],
        created : {type: Date, default : Date.now},
        updated : {type: Date, default : Date.now}
    });
    
const Shelf = mongoose.model('bookshelves', shelfSchema);

module.exports = Shelf;