const express = require('express');
const app = express();
// const mongoose = require('mongoose');
const {ApolloServer} = require('apollo-server-express')
const {typeDefs} = require('./Schema/TypeDefs')
const {resolvers} = require('./Schema/Resolvers')

const server = new ApolloServer({typeDefs, resolvers});
server.start().then(res=>{
    server.applyMiddleware({app});
    app.listen(3000, () => 
        console.log(`Server running on port 3000`)
    );
});

// const shelfSchema = new mongoose.Schema({
//     name : {type : String},
//     book_ids : [{
//         book_id : {
//             type: mongoose.Schema.ObjectId,
//             ref : 'books'
//         },
//         added_date : {type: Date, default : Date.now},
//         stock : {type: Number}
//     }],
//     datetime : [{
//         date : {type: String},
//         time : {type: String}
//     }],
//     created : {type: Date, default : Date.now},
//     updated : {type: Date, default : Date.now}
// });

// const Shelf = mongoose.model('bookshelves', shelfSchema);

const user = [{
    id : 1,
    username : 'safira',
    password : 'pass'
}];

app.use(express.json())

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
        title : req.body.title,
        author : req.body.author,
        date_published : req.body.data_published,
        price : req.body.price
    }])
    // await data;
    res.send(data);
});

// app.get('/read', auth, async (req, res)=>{
    
// })

app.get('/update', auth, async (req, res)=>{
    let data = Book.updateOne({_id: req.body.id}, {price : req.body.price, updated : req.body.updated});
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

app.post('/insert-book', async (req, res)=>{
    let data = new Shelf({
        name : req.body.name,
        book_ids : req.body.book_ids,        
        datetime : req.body.datetime        
    });
    await data.save() 
    res.send(data);
})

app.get('/delete-book', auth, async (req, res)=>{
    let result = Shelf.deleteMany();
    await result;
    res.send('done');
});

app.get('/find-book', auth, async (req, res)=>{
    let result = await Shelf.find({
        book_ids : {
            $elemMatch : {book_id :{$eq : req.body.book_id}}
        }
    })
    res.send(result);
});

app.get('/update-book', auth, async (req, res)=>{
    let data = Shelf.updateMany({ },
        { $set: { "datetime.$[elem].time" : req.body.date.time } },
        { arrayFilters: [ { "elem.date": { $eq: req.body.date.date } } ] });
    await data;
    let result = await Shelf.find({
        date: {
            $elemMatch : {datetime :{$eq : req.body.date[0].time}} 
        }
    })
    res.send(result);
});

app.get('/aggregate', auth, async (req, res)=>{
    let data = await Shelf.aggregate(([
        {
            $addFields : {
                total_stock : {
                    $sum : req.body.criteria_1
                }
            }
        },{
            $project : {
                book_ids : req.body.criteria_2
            }
        },{
            $unwind : req.body.criteria_3
        }
    ]))
    res.send(data);
});

app.get('/aggregate-book', auth, async (req, res)=>{
    let data = await Book.aggregate([{
        $match : {author : req.body.author}
    },{
        $sort : {title :req.body.sort_by}
    },{
        $addFields : {
            published : {$concat: [req.body.name , "-", req.body.city]}
        }
    }]);
    res.send(data);
})

app.get('/join-data', auth, async (req, res)=>{
    let data = await Shelf.aggregate( [{
            $lookup:{
                from: req.body.from,
                localField: req.body.local,
                foreignField: req.body.foreign,
                as: req.body.as
            }
        }
    ]);
    res.send(data);
})

app.get('/pagination', auth, async (req, res)=>{
    let result = await Shelf.aggregate([{
        $facet : {
            data : [{
                $unwind : req.body.data
            },{
                $project : {
                    book_ids : req.body.value
                }
            },{
                $lookup:{
                    from: req.body.from,
                    localField: req.body.local,
                    foreignField: req.body.foreign,
                    as: req.body.as
                }
            },{
                $skip : req.body.page       
            },{
                $limit : req.body.limit
            }]
        }
    }])
    res.send(result);
})

app.get('/group', auth, async (req, res)=>{
    let data = await Shelf.aggregate( [ { 
        $group : { 
            _id : req.body.group 
        } 
    } ] )
    res.send(data);
})

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