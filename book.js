let bookName = "Book Name";
const disc = 12/100;
const tax = 10/100;
var price = 100000;
var pad;
var pat;

let ver1 = (disc == 0.12);
let ver2 = (tax == 0.1);


function purchasing(book, price, discount, tax){
    if(ver1 == true && ver2 == true){
        pad = price*(1-disc);
        pat = pad+(pad*tax);
    }
    data = "Book : " + book + "\n" +
            "Price : Rp" + price + "\n" +
            "Discount : " + price*discount + " (" + discount*100 + "%)" + "\n" +
            "Price After Discount : Rp" + pad + "\n" +
            "Tax : " + pad*tax + " (" + tax*100 + "%)" + "\n" +
            "Total: Rp" + pat;
    return data;
}

console.log(purchasing(bookName, price, disc, tax));