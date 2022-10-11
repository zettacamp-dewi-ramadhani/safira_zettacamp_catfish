let book = "Book Name";
var desc = "Book Description";
const disc = 20/100;
const tax = 10/100;
var price = 100000;
var pad;
var pat;

let ver1 = (disc == 0.2);
let ver2 = (disc == 0.2);

// price after discount
function discount(price){
    let result1 = price*(1-disc);
    if(ver1 == true){
        return result1;
    }
}

// price after tax
function taxing(price){
    let result2 = price+(price*tax);
    if(ver2 == true){
        return result2;
    }
}

pad = discount(price);
pat = taxing(pad);

console.log(book,desc,price,pad,pat);