const express = require ('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const tokenSecret = 'secret';
const multer = require('multer');
const forms = multer();
const user = [{
    id : 1,
    username : 'safira',
    password : 'zetta'
}];

app.use(bodyParser.json());
app.use(forms.array());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/',(req, res)=>{
    const uname = req.body.username;
    const pass = req.body.password;
    
    if(uname === user[0].username && pass === user[0].password){
        const token = jwt.sign({
            id : user[0].id},
            tokenSecret,{expiresIn: '1h'}
        );
        res.json(token);
    }else{
        res.send({message: 'User not found'});
    }
});



const authJwt = (req, res, next)=>{
    const auth = req.headers.authorization;
    if(auth === undefined){
        return res.send({message: 'Authorization is empty'});
    }else{
        const access = auth.split(' ')[1];
        const ver = jwt.verify(access, tokenSecret);
        const users = user.find(({id})=> id === ver.id );
        req.user = users;
        next();
    }
}

app.get('/artist', authJwt, (req,res)=>{
    try{
        let result = artist("Blackpink");
        res.send(result);
    }catch(e){
        res.sendStatus(401);
    }
});

app.get('/genre', authJwt, (req,res)=>{
    try{
        res.send(genreGroup);
    }catch(e){
        res.sendStatus(401);
    }
});

app.get('/playlist', authJwt, async (req,res)=>{
    try{
        let result = await playlist();
        res.send(result);
    }catch(e){
        res.sendStatus(401);
    }
})

app.listen(3000);

let songList = [
    // 1
    {
        "titile" : "Bad Habits",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "3.50"
    },
    //2
    {
        "titile" : "Overpass Graffiti",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "4.56"
    },
    // 3
    {
        "titile" : "Lovesick Girls",
        "artist" : "Blackpink",
        "album" : "The Album",
        "genre" : "K-pop",
        "duration" : "4.17"
    },
    // 4
    {
        "titile" : "Grand Escape",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "5.39"
    },
    // 5
    {
        "titile" : "Clarity",
        "artist" : "Zedd, Foxes",
        "album" : "Clarity",
        "genre" : "Dance",
        "duration" : "4.36"
    },
    // 6
    {
        "titile" : "Firework",
        "artist" : "Katy Perry",
        "album" : "Teenage Dream",
        "genre" : "Pop",
        "duration" : "5.47" 
    },
    // 7
    {
        "titile" : "I Can't Stop Me",
        "artist" : "TWICE",
        "album" : "Eyes Wide Open",
        "genre" : "K-pop",
        "duration" : "4.25"
    },
    // 8
    {
        "titile" : "Pretender",
        "artist" : "Hige DANdism",
        "album" : "Traveler",
        "genre" : "J-Pop",
        "duration" : "5.26"
    },
    // 9
    {
        "titile" : "Heroes (we could be)",
        "artist" : "Alesso, Tove Lo",
        "album" : "Forever",
        "genre" : "Dance",
        "duration" : "5.35",
    },
    // 10
    {
        "titile" : "Unconditionally",
        "artist" : "Katy Perry",
        "album" : "PRISM",
        "genre" : "Pop",
        "duration" : "4.48" 
    },
    // 11
    {
        "titile" : "Ready For Love",
        "artist" : "Blackpink",
        "album" : "Born Pink",
        "genre" : "K-pop",
        "duration" : "10.00"
    },
    // 12
    {
        "titile" : "More & More",
        "artist" : "TWICE",
        "album" : "More & More",
        "genre" : "K-pop",
        "duration" : "5.19"
    },
    //13
    {
        "titile" : "XOXO",
        "artist" : "Jeon Somi",
        "album" : "XOXO",
        "genre" : "K-pop",
        "duration" : "4.27"
    },
    // 14
    {
        "titile" : "Celebration",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "4.34"
    },
    // 15
    {
        "titile" : "Coin",
        "artist" : "IU",
        "album" : "Lilac",
        "genre" : "K-pop",
        "duration" : "5.18",
    }
];

// group based artist
function artist(artist){
    let obj = {};
    const artistGroup = songList.filter(song => song.artist == artist);
    const map = new Map;
    map.set(artist, artistGroup);
    map.forEach((v,k)=>{
        obj[k] = v;
    });
    return obj;
}

// group based genre
const genreGroup = songList.reduce((group, song) => {
    const {genre} = song;
    group[genre] = group[genre] || [];
    group[genre].push(song);
    return group;
}, {});

let randomArray = (x)=>{
    let arr = [];
    while(x.length !== 0){
        let randomIndex = Math.floor(Math.random()*x.length);
        arr.push(x[randomIndex]);
        x.splice(randomIndex, 1);
    }
    x = arr;
    return x;
}

// playlist less than 1 hour
async function playlist(){
    let songIndex = 0;
    let temp=0;
    let set = new Set();
    let map = new Map();
    let obj = {};

    let song = await randomArray(songList);
    // return song[0];

    for (let i = 0; i < song.length; i++) {
        time = song[i].duration.split(".");
        let menit = parseInt(time[0])*60;        
        let detik = parseInt(time[1]);
        temp = temp + (menit+detik); 
        if(temp < 3600){
            songIndex++;
        }
    }

    for (let i = 0; i < songIndex; i++) {
        // return song;
        set.add(song[i]);            
    }
    // return set;
    
    let [...data] = set;
    for(i=0; i<data.length; i++){
        map.set(i+1, data[i]);
    }

    map.forEach((v,k)=>{
        obj[k] = v;
    });
    return obj;
}