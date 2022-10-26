const express = require('express');
const app = express();
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/zettacamp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('connect'))
.catch((err)=>console.log(err));

const bookSchema = new mongoose.Schema({
    title : {type: String},
    author : {type: String},
    date_published : {type: String},
    price : {type: Number},
    created : {type: Date, default : Date.now},
    updated : {type: Date, default : Date.now}
});

const Book = mongoose.model('books', bookSchema);

const shelfSchema = new mongoose.Schema({
    name : {type : String},
    book_ids : [{type: mongoose.ObjectId}]
});

const Shelf = mongoose.model('bookshelves', shelfSchema);

const user = [{
    id : 1,
    username : 'safira',
    password : 'pass'
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

const auth = (req, res, next)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");

    const uname = text.split(":")[0];
    const pass = text.split(":")[1];

    if(uname == user[0].username && pass == user[0].password){
        try{
            // id : user[0].id;
            return next();
        }catch{
            res.send("Error, check again");
        }
    }else{
        res.send("Access Denied");
    }
}

app.get('/book-purchased',auth, async (req, res)=>{  
    try{
        let result = await credit(4, myBook[0]);
        res.send(result);
    }catch{
        res.send("Error, check again");
    }
});

app.get('/set-map',auth, async (req, res)=>{  
    try{
        let result = await setMap(myBook[0]);
        res.send(result);
    }catch{
        res.send("Error, check again");
    }
});

app.post('/insert', auth, (req, res)=>{
    let data = Book.insertMany([{
        title : "Hyouka",
        author : "Honobu Yonezawa",
        date_published : "2014",
        price : 75000
            
    },{
        name : "Filosofi Kopi",
	    author : "Dewi Lestari",
	    date_published : "2006",
	    price : 36000
    },{
        title : "Perahu Kertas",
        author : "Dewi Lestari",
        date_published : "2003",
        price : 80000
            
    },{
        name : "Another",
	    author : "Yukito Ayatsuji",
	    date_published : "2009",
	    price : 80000
    },{
        title : "Garis Waktu",
        author : "Fiersa Berari",
        date_published : "2016",
        price : 68000
            
    },{
        name : "11:11",
	    author : "Fiersa Besari",
	    date_published : "2018",
	    price : 80000
    }])
    // await data;
    res.send(data);
});

app.get('/read', auth, async (req, res)=>{
    let result = await Book.find()
    res.send(result);
})

app.get('/update', auth, async (req, res)=>{
    let data = Book.updateOne({_id: '63579767e989d201a4415d79'}, {price : 40000, updated : ""});
    await data;
    let result = await Book.find({
        price : 40000
    });
    res.send(result);
})

app.get('/delete', auth, async (req, res)=>{
    let result = Book.deleteMany();
    await result;
    res.send('done');
});

app.post('/insert-book', (req, res)=>{
    let data = Shelf.insertMany([{
        name : 'sastra',
        book_id : ["6357e72c1363b0078c6ed427", "63587882066298a4ea63ff3c"]
        // name : req.body.name,
        // book_id : [req.body.book_id]
            
    }]);
    res.send(data);
})

app.get('/delete-book', auth, async (req, res)=>{
    let result = Shelf.deleteMany();
    // let result = Shelf.deleteOne({_id: '6357ecc767b3611bc415fc89'});
    await result;
    res.send('done');
});

app.get('/find-book', auth, async (req, res)=>{
    let result = await Shelf.find({
        book_id : {
            $elemMatch : {$in :'6357e72c1363b0078c6ed427'}
        }
    })
    res.send(result);
});

app.get('/update-book', auth, async (req, res)=>{
    let data = Shelf.updateOne({_id:'6358947de3e29c287c038e65'}, {
        $push : {book_id: '6357e72c1363b0078c6ed424'}
    });
    await data;
    let result = await Shelf.find({
        book_id : {
            $elemMatch : {$in :'6357e72c1363b0078c6ed424'}
        }
    });
    res.send(result);
})

app.listen(3000);

myBook = [
    {
        name : 'Book A',
        price : 100000,
        stock : 2,
        purchased : 10,
        credit : false
    },{
        name : 'Book B',
        price : 200000,
        stock : 2,
        purchased : 10,
        credit : true
    }
]

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
        // console.log(data);
        const result = data.concat(due);
        return result;
        // console.log(result);
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