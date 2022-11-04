const Book = require('../Model/bookModel');
const Shelf = require('../Model/shelfModel');
// const shelfLoader = require('../Controller/dataloader')

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

const insertBook = async(parent, {input: {title,author,date_published,price}})=>{
    let data = new Book({
        title : title,
        author : author,
        date_published : date_published,
        price : price,
        created : new Date().toISOString(),
        updated : new Date().toISOString()
    });
    const res = await data.save();
    return res;
}

const updateTitleBook = async(parent, {input: {id, title}})=>{
    let data = await Book.findByIdAndUpdate({
        _id: id
    },{$set :{
        title : title,
        updated : new Date().toISOString()
    }});
    // console.log(data)
    return data;
}

const deleteBook = async(parent, {input : {id}})=>{
    let data = await Book.findByIdAndDelete({
        _id : id
    })
    // await data;
    console.log(data);
    return data;
}

const getAllBooks = async()=>{
    let result = await Book.find();
    return result;
}

const getAllShelf = async(parent, {input: {page,limit}}) =>{
    let result = await Shelf.aggregate([{
        $skip : page*limit   
    },{
        $limit : limit
    }]);
    // console.log(result)
    return result;
}

const getBooklistDataLoader = async (parent, args, ctx)=>{
    // console.log(parent)
    if(parent.book_id){
        const result = await ctx.shelfLoader.load(parent.book_id);
        console.log(result)
        return result
    }
}

const paginationBook = async(parent, {input : {page, limit}})=>{
    let result = await Book.aggregate([{
        $skip : page*limit   
    },{
        $limit : limit
    }])
    return result;
}

module.exports = {
    getAllBooks,
    getAllShelf,
    insertBook,
    updateTitleBook,
    deleteBook,
    paginationBook,
    getBooklistDataLoader
}