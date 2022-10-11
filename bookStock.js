var bookName = "Book A";
let bookPrice = 100000;
const bookStock = 10;
const bookPurchased = 5;

const disc = 15/100;
const tax = 10/100;

function purchasing(name, price, stock, purchased, disc, tax){
    if(stock!=0){
        console.log("The book is available\n");
        for(i=0; i<=purchased; i++){
            console.log("----------- Purchasing #" + (i+1) + "-----------\n");
            console.log("Book : " + name);
            console.log("Price : " + price);
            console.log("Discount : " + price*disc + " (" + disc*100 + "%)");
            pad = price*(1-disc);
            console.log("Price after discount : Rp" + pad);

            console.log("Tax : " + pad*tax + " (" + tax*100 + "%)");
            pat = pad+(pad*tax);
            console.log("Total : Rp" + pat);

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

purchasing(bookName, bookPrice, bookStock, bookPurchased, disc, tax);