const express = require('express');
const app = express();
const fs = require('fs');
// const fsp = require('fs').promise;
const events = require('events');
let eventEmitter = new events.EventEmitter();

const user = [{
    id : 1,
    username : 'safira',
    password : 'pass'
}];

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

app.get('/with-await', (req, res)=>{
    // res.send(readFileAwait('./myText.txt'));
    eventEmitter.on('Aftertext', readFileAwait);
    const result = eventEmitter.emit('Aftertext', './myText.txt');
    res.send(result);
});

app.get('/without-await', (req, res)=>{
    // res.send(readFile('./myText.txt'));
    eventEmitter.on('Aftertext', readFile);
    const result = eventEmitter.emit('Aftertext', './myText.txt');
    res.send(result);
});

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

const getFile = (file)=>{
    fs.readFile(file, 'utf8', (err, data)=>{
    if(err){
        throw err;
    }
    const file = data;
    console.log(file);
});
}

function dataPromiseAwait(file){ new Promise((res,rej)=>{
    if(file === './myText.txt'){
        setTimeout(()=>res(getFile(file)), 3000);
    }else{
        rej(console.log("File Error"));
    }
});
}

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