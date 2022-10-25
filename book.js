const express = require('express');
const app = express();
const fs = require('fs');
// const fsp = require('fs').promise;
const events = require('events');
let eventEmitter = new events.EventEmitter();
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// connect
mongoose.connect("mongodb://localhost:27017/zettacamp", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('connect'))
.catch((err)=>console.log(err));

// schema
const bookSchema = new mongoose.Schema({
    title : {type: String},
    author : {type: String},
    date_published : {type: String},
    price : {type: Number},
    created : {type: Date, default : Date.now},
    updated : {type: Date, default : Date.now}
});

const Book = mongoose.model('books', bookSchema);

async function insertData(){
    const data = Book({
        title : "Obsesi",
        author : "Lexie Xu",
        date_published : "2010",
        price : 40000,
    });
    await data.save();
}
// insertData();

function deleteData(){
    Book.deleteOne({tittle : "Obsesi"}, (err)=>{
        if(err){
            console.log(err)
        }else{
            console.log("Done");
        }
    })
}

// deleteData();


const user = [{
    id : 1,
    username : 'safira',
    password : 'pass'
}];

app.use(bodyParser.raw);

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

app.get('/set-map', async (req, res)=>{  
    try{
        let result = await setMap(myBook[0]);
        res.send(result);
    }catch{
        res.send("Error, check again");
    }
});

// app.get('/with-await', (req, res)=>{
//     // res.send(readFileAwait('./myText.txt'));
//     eventEmitter.on('Aftertext', readFileAwait);
//     const result = eventEmitter.emit('Aftertext', './myText.txt');
//     res.send(result);
// });

// app.get('/without-await', (req, res)=>{
//     // res.send(readFile('./myText.txt'));
//     eventEmitter.on('Aftertext', readFile);
//     const result = eventEmitter.emit('Aftertext', './myText.txt');
//     res.send(result);
// });

app.post('/insert', auth, (req, res)=>{
    let data = new Book({
        title : "Omen",
        author : "Lexie Xu",
        date_published : "2016",
        price : 48000,
        created : "",
        updated : ""
    })
    data.save();
    // console.log(data)
    res.send({message: 'halo'});
    // return;
});

app.get('/read', auth, async (req, res)=>{
    let result = await Book.find()
    res.send(result);
})

app.get('/update', auth, (req, res)=>{
    Book.updateOne({_id: 10}, {price : 180000, updated : ""}, (err)=>{
        if(err){
            res.send(err);
        }else{
            res.send('Done');
        }
    })
})

app.get('/delete', auth, async (req, res)=>{
    Book.deleteOne({tittle : "Aku Tahu Kapan Kamu Mati"}, (err)=>{
        if(err){
            res.send({message: err});
        }else{
            res.send("Done");
        }
    })
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

// purchasing
function purchasing(book, disc, tax){
    pad = book.price*(1-disc);
    book.price = pad+(pad*tax);
    return book;
}

// credit
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

// set & map
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

// get file
const getFile = (file)=>{
    fs.readFile(file, 'utf8', (err, data)=>{
    if(err){
        throw err;
    }
    const file = data;
    console.log(file);
});
}

// promise
function dataPromiseAwait(file){ new Promise((res,rej)=>{
    if(file === './myText.txt'){
        setTimeout(()=>res(getFile(file)), 3000);
    }else{
        rej(console.log("File Error"));
    }
});
}

// read file with await
const readFileAwait = async (file) =>{
    console.log("Process Start With Await")
    // console.log(dataPromiseAwait);
    const data = await dataPromiseAwait(file)
    // data.then((data)=>{
    //     return data;
    // }).catch((e)=>{
    //     e = "Process Stop"
    //     console.log(e);
    // })
    // .finally((data)=>{
        return data;
    // });
};

// read file without await
const readFile = (file) =>{
    console.log("Process Start")
    const dataPromise = new Promise((res,rej)=>{
        if(file === './myText.txt'){
            res(getFile(file));
        }else{
            rej(console.log("File Error"));
        }
    });
    const result = dataPromise.then((data)=>{
        return data;
    }).catch((e)=>{
        e = "Process Stop"
        console.log(e);
    }).finally((data)=>{
        console.log("All Done");
    });
    return result;
}