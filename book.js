const express = require('express');
const app = express();
const fs = require('fs');
// const fsp = require('fs').promise;
const events = require('events');
let eventEmitter = new events.EventEmitter();

let myBook = [
    {
        name : "Book A",
        author : "asdfg",
        price : 100000,
        credit : "Credit Unavailable"
    },
    {
        name : "Book B",
        author : "hjkl",
        price : 150000,
        credit : "Credit Available"
    },
    {
        name : "Book C",
        author : "mno",
        price : 200000,
        credit : "Credit Unavailable"
    },
    {
        name : "Book D",
        author : "pqrs",
        price : 250000,
        credit : "Credit Available"
    }
];

app.get('/', async (req, res)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");
        
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "uname" && pass == "pass"){
        try{
            let result = await credit(4);
            res.send(result);
        }catch{
            res.send("Error, check again");
        }
    }else{
        res.send("Access Denied");
    }
});

app.listen(3000);

function purchasing(book, disc, tax){
    pad = book.price*(1-disc);
    book.price = pad+(pad*tax);
    return book;
}

async function credit(toc){
    let book = await purchasing(myBook[1], 0.12, 0.1);
    var creditPrice = [];
    var due = [];
    let credit;
    let poc = 0;
    let data = []

    if(book.credit === "Credit Available"){
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

const getFile = (file)=>{
    fs.readFile(file, 'utf8', (err, data)=>{
    if(err){
        throw err;
    }
    const file = data;
    console.log(file);
});
}

// const promiseAwait = ((file)=>{
//     new Promise((res, rej)=>{
//         res(getFile(file));
//     });
// });

// async function readFileAwait(file){
//     console.log("Process Start With Await");
//     const result = await fsp.readFile(file);
//     return Buffer.from(result);
    
    // const result = await promise.then((data)=>{
    //     return data;
    // }).catch((e)=>{
    //     e = "Process Stop";
    //     console.log(e);
    // });
    // return result;
// }

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

app.get('/set-map', (req, res)=>{
    let obj = setAndMap(myBook)
    res.send(obj);

});

function setAndMap(x){
    let set = new Set();
    set.add(x);
    let [...data] = set;
    let obj = {};
    // return data;

    let map = new Map();
    for(i=0; i<data.length; i++){
        map.set(i+1, data[i]);
    }
    map.forEach((v, k)=>{
        obj[k] = v;
    })
    return obj;
}