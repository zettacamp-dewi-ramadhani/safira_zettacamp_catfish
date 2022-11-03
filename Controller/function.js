const Book = require('../Model/bookModel');
const Shelf = require('../Model/shelfModel');

function purchasing(book, disc, tax){
    pad = book.price*(1-disc);
    book.price = pad+(pad*tax);
    return book;
}

async function credit(toc,x){
    let book = await purchasing(x, 0.12, 0.1);
    var creditPrice = [];
    var due = [];
    let credit;
    let poc = 0;
    let data = []

    if(book.credit === true){
        for (i=0; i<toc; i++){
            credit = {};
            credit.month = i+1;
            price = book.price/toc+(book.price/toc*(poc/100));
            creditPrice.push(price);
            credit.price = creditPrice[i];
            due.push(credit);
            poc+=10;
        }
        data.push(book);
        const result = data.concat(due);
        return result;
    }else{
        return book;
    }
}

async function setMap(x){
    const data = await credit(5, x);
    const set = new Set();
    const map = new Map();
    let obj = {};
    
    if(data.credit === true){
        let [book, ...due] = data;
        set.add(book);
        set.add(due);

        map.set('Book Detail', book);
        map.set('Term Of Credit', due);
        map.forEach((v,k)=>{
            obj[k] = v;
        });
        return obj;
    }else{
        map.set('Book Detail', data);
        map.set('Term Of Credit', 'Not Available');
        map.forEach((v,k)=>{
            obj[k] = v;
        });
        return obj;
    }
}

const insertBooks = async(dataTitle, dataAuthor, dataDate, dataPrice)=>{
    let data = new Book({
        title : dataTitle,
        author : dataAuthor,
        date_published : dataDate,
        price : dataPrice
    });
    await data.save();
    console.log(data)
    return data
}

const getAllBooks = async()=>{
    let result = await Book.find();
    return result;
}

const getAllShelf = async() =>{
    let result =  await Shelf.find();
    return result;
}

module.exports = {
    getAllBooks,
    getAllShelf,
    insertBooks
}