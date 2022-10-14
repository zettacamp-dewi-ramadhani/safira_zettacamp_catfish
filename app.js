const express = require('express')
const app = express()
// var jwt = require('jsonwebtoken')


app.get('/', function(req, res){
    // res.send('Hello World')
    const auth = req.headers["authorization"].replace("Basic ", "");
    // console.log(auth)
    const text = Buffer.from(auth, "base64").toString("ascii");
    // console.log(text)
    
    const uname = text.split(":")[0];
    const pass = text.split(":")[1];
    
    if(uname == "safira" && pass == "pass"){
        console.log("tes");
    }else{
        return res.json("Access Denied");
    }
    // const token = jwt.sign({
    //     name : "safira"
    // }, 'shhh'
    // )
    // // console.log(token)
    // const decode = jwt.decode(token, 'shhh')
    // console.log(decode)
})

app.listen(3000)
