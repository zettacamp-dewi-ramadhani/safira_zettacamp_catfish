let book = "Book Name";
var desc = "Book Description";
const disc = 20/100;
const tax = 10/100;
var price = 100000;
var pad;
var pat;

let ver1 = (disc == 0.2);
let ver2 = (disc == 0.2);


function purchasing(book, price, discount, tax){
    if(ver1 == true && ver2 == true){
        pad = price*(1-disc);
        pat = pad+(pad*tax);
    }
    data = "Book : " + book + "\n" +
            "Price : Rp" + price + "\n" +
            "Discount :" + discount*100 + "%" + "\n" +
            "Price After Discount: Rp" + pad + "\n" +
            "Tax : " + tax*100 + "%" + "\n" +
            "Total: Rp" + pat;
    return data;
}

console.log(purchasing(book, price, disc, tax));