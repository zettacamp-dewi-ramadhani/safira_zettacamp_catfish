const DataLoader = require('dataloader');
const Book = require('../Model/bookModel');

const bookLoader = async (bookId)=>{
    const bookList = await Book.find({
        _id: {
            $in : bookId
        }
    });
    return bookList;
    
    // const bookMap = {};

    // bookList.forEeach((x)=>{
    //     bookMap[x._id] = x;
    // });
    
    
    // console.log(bookMap);
    // return bookId.map(id=>bookMap[id]);
}

const shelfLoader = new DataLoader(bookLoader);
module.exports = shelfLoader