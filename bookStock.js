const express = require('express')
const app = express()

var bookName = "Book A";
// let bookPrice = 100000;
const bookStock = 1;
const bookPurchased = 5;

const disc = 15/100;
const tax = 10/100;
// const toc = 5;

var creditPrice = [];
var due = [];
let credit;
var poc = 0;

app.get('/', function(req, res){
    const auth = req.headers["authorization"].replace("Basic ", "");
    const text = Buffer.from(auth, "base64").toString("ascii");

    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "safira" && pass == "pass"){
        function purchasing(name, price, stock, purchased, disc, tax, toc){
    if(stock!=0){
        console.log("The book is available\n");
        for(i=0; i<=stock; i++){
            console.log("----------- Purchasing #" + (i+1) + "-----------\n");
            console.log("Book : " + name);
            console.log("Price : " + price);
            console.log("Discount : " + price*disc + " (" + disc*100 + "%)");
            pad = price*(1-disc);
            console.log("Price after discount : Rp" + pad);

            console.log("Tax : " + pad*tax + " (" + tax*100 + "%)");
            pat = pad+(pad*tax);
            console.log("Total : Rp" + pat);

            for(let i=0; i<toc; i++){
                credit = {}
                credit.month = i+1;
                creditPrice.push(pat/toc+(pat/toc*(poc/100)));
                credit.price = creditPrice[i];
                due.push(credit);  
                poc+=10;              
            }
            res.send(due);

            console.log("----------------------------------");
            const [doc, ...up] = due;
            console.log("Due of Credit :");
            console.log(doc);
            console.log("----------------------------------");
            console.log("Upcoming Due :")
            console.log(up);
            console.log("----------------------------------");

            stock=stock-1;
            console.log("Stock :" + stock);
            purchased=purchased+1;

            console.log("Purchased :" + purchased);
            if(stock!=0){
                console.log("\nThe book still can be purchased\n");
                console.log("----------------------------------\n");
            }else{
                console.log("----------------------------------\n");
                console.log("\nThe book is out of stock");
                break;
            }
        }
    }else{
        console.log("The book is out of stock");
    }
}
        // res.send(
            purchasing(bookName, 128000, bookStock, bookPurchased, disc, tax, 4);
    }else{
        return res.json("Access Denied");
    }
})



app.listen(3000)