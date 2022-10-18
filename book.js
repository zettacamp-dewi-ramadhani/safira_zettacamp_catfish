const { rejects } = require('assert');
const express = require('express');
const app = express();
const fs = require('fs');

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
        price : 200000,
        credit : "Credit Available"
    }
];

app.get('/', async (req, res)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");
        
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "uname" && pass == "pass"){
        // res.json(purchasing(myBook[0]));
        // console.log(purchasing(myBook[0]));
        // purchasing(myBook[0]);
        try{
            let result = await credit('b');
            res.send(result);
        }catch{
            res.send("Error, check again");
        }
    }else{
        res.send("Access Denied");
    }
});

app.listen(3000);

async function purchasing(book, disc, tax){
    pad = book.price*(1-disc);
    book.price = pad+(pad*tax);
    return book;
    // let purchased = new Promise(resolve =>{
    //     resolve(book);
    // });
    // return purchased;
}

 async function credit(toc){
    let book = await purchasing(myBook[1], 0.12, 0.1);
    var creditPrice = [];
    var due = [];
    let credit;
    let poc = 0;
    let data = []

    if(book.credit === "Credit Available"){
        // console.log(book);
        // setTimeout(()=>{
        // }, 3000);
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
        // console.log("Due Credit")
    }else{
        return book;
    }
}

function getFile(file){
    fs.readFile(file, 'utf8', (err, data)=>{
    if(err){
        throw err;
    }
    const file = data;
    console.log(file);
});
}

const readFileAwait = async filename =>{
    const result = await getFile(filename);
    return result;
}


function readFile(file){
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
        e = "Stop the Process"
        console.log(e);
    }).finally((data)=>{
        console.log("All Done");
    });
    return result;
}

app.get('/with-await', (req, res)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");
        
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "uname" && pass == "pass"){
        res.send(readFileAwait('./myText.txt'));
    }else{
        res.send("Access Denied");
    }
});

app.get('/without-await', (req, res)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");
        
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "uname" && pass == "pass"){
        res.send(readFile('data'));
    }else{
        res.send("Access Denied");
    }
});