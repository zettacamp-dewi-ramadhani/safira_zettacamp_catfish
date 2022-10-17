const express = require('express');
const app = express();

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

app.get('/', (req, res)=>{
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");
        
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "uname" && pass == "pass"){
        // res.json(purchasing(myBook[0]));
        // purchasing(myBook[0]);
        res.json(credit(5));
    }else{
        res.json("Access Denied");
    }
});

app.listen(4000);

function purchasing(book, disc, tax){
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
        // console.log(book)
        // console.log(due);
        console.log(result);
    }else{
        console.log(ImageData);
    }
}
