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



const songSchema = new mongoose.Schema({
    title : {type : String},
    artist : {type : String},
    album : {type : String},
    genre : {type : String},
    duration : {type : String}
});

const playlistSchema = new mongoose.Schema({
    playlist : {type : String},
    song_ids : [{
        song_id : {
            type: mongoose.Schema.ObjectId,
            ref : 'songs'
        },
        added_date : {
            type : Date,
            default : Date.now()
        }
    }],
    created_at : {type : Date, default : Date.now()},
    updated_at : {type : Date, default : Date.now()}
})

const Song = mongoose.model('songs', songSchema);
const SongPlaylist = mongoose.model('playlists', playlistSchema);

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
    // let list = req.body
    try{
        let result = await playlist();
        res.send(result);
    }catch(e){
        res.sendStatus(401);
    }
});

app.post('/insert-song', authJwt, async(req,res)=>{
    let song = req.body;
    let result = await insertSong(song.title, song.artist, song.album,song.genre, song.duration);
    res.send(result);
});

app.post('/insert-playlist', authJwt, async(req,res)=>{
    let list = req.body;
    let result = await insertPlaylist(list.name, list.song_ids);
    res.send(result);
});

app.post('/delete-song', authJwt, async(req,res)=>{
    let song = req.body;
    let result = await deleteSong(song.id);
    res.send(result);
});

app.post('/update-song', authJwt, async(req,res)=>{
    let song = req.body;
    let result = await updateSong(song.title, song.duration);
    res.send(result);
});

app.post('/get-song', authJwt, async(req, res)=>{
    let data = req.body
    let result = await getAllSong(data.skip, data.limit, data.time);
    res.send(result);
});

app.post('/get-playlist', authJwt, async(req, res)=>{
    let data = req.body
    let result = await getPlaylist(data.song, data.skip, data.limit, data.from, data.local, data.foreign, data.as);
    res.send(result);
});

app.listen(4000);

let songList = [
    // 1
    {
        "title" : "Bad Habits",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "3.50"
    },
    //2
    {
        "title" : "Overpass Graffiti",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "4.56"
    },
    // 3
    {
        "title" : "Lovesick Girls",
        "artist" : "Blackpink",
        "album" : "The Album",
        "genre" : "K-pop",
        "duration" : "4.17"
    },
    // 4
    {
        "title" : "Grand Escape",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "5.39"
    },
    // 5
    {
        "title" : "Clarity",
        "artist" : "Zedd, Foxes",
        "album" : "Clarity",
        "genre" : "Dance",
        "duration" : "4.36"
    },
    // 6
    {
        "title" : "Firework",
        "artist" : "Katy Perry",
        "album" : "Teenage Dream",
        "genre" : "Pop",
        "duration" : "5.47" 
    },
    // 7
    {
        "title" : "I Can't Stop Me",
        "artist" : "TWICE",
        "album" : "Eyes Wide Open",
        "genre" : "K-pop",
        "duration" : "4.25"
    },
    // 8
    {
        "title" : "Pretender",
        "artist" : "Hige DANdism",
        "album" : "Traveler",
        "genre" : "J-Pop",
        "duration" : "5.26"
    },
    // 9
    {
        "title" : "Heroes (we could be)",
        "artist" : "Alesso, Tove Lo",
        "album" : "Forever",
        "genre" : "Dance",
        "duration" : "5.35",
    },
    // 10
    {
        "title" : "Unconditionally",
        "artist" : "Katy Perry",
        "album" : "PRISM",
        "genre" : "Pop",
        "duration" : "4.48" 
    },
    // 11
    {
        "title" : "Ready For Love",
        "artist" : "Blackpink",
        "album" : "Born Pink",
        "genre" : "K-pop",
        "duration" : "10.00"
    },
    // 12
    {
        "title" : "More & More",
        "artist" : "TWICE",
        "album" : "More & More",
        "genre" : "K-pop",
        "duration" : "5.19"
    },
    //13
    {
        "title" : "XOXO",
        "artist" : "Jeon Somi",
        "album" : "XOXO",
        "genre" : "K-pop",
        "duration" : "4.27"
    },
    // 14
    {
        "title" : "Celebration",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "4.34"
    },
    // 15
    {
        "title" : "Coin",
        "artist" : "IU",
        "album" : "Lilac",
        "genre" : "K-pop",
        "duration" : "5.18",
    }
];

const insertSong = async (songTitle, songArtist, songAlbum, songGenre, songDuration) =>{
    let data = new Song({
        title : songTitle,
        artist : songArtist,
        album : songAlbum,
        genre : songGenre,
        duration : songDuration
    })
    await data.save();
    return data;
};

const insertPlaylist = async (playlistName, playlistSong) =>{
    let data = new SongPlaylist({
        playlist : playlistName,
        song_ids : playlistSong
    })
    await data.save();
    return data;
}

const deleteSong = async (songId) =>{
    let data = Song.deleteOne({
        _id : songId
    });
    await data;
    let result = await Song.find();
    return result;
}

const updateSong = async (songTitle, songDuration) =>{
    let data = Song.updateOne({
        title : songTitle
    },{
        $set :{
        duration : songDuration}
    })
    await data;
    let result = await Song.find({
        duration : songDuration
    });
    return result;
}

const readSong = async()=>{
    let data = await Song.find();
    return data;
}

const getAllSong = async(skipData, limitData, timeData)=>{
    let data = await Song.aggregate([{
        $facet :{
            song : [{
                $match : {
                    duration : {$gte : timeData}
                }
            },{
                $skip : skipData
            },{
                $limit : limitData
            }],
            countData : [{
                $group : {
                    _id: null,
                    count: {
                        $sum :1
                    }
                }
            }]
        }
    }])
    return data;
}

const getPlaylist = async(songData, skipData, limitData, fromData, localData, foreignData, asData)=>{
    let data = await SongPlaylist.aggregate([{
        $facet :{
            song : [{
                $unwind: songData
            },{
                $project : {
                    song_ids : 1
                }
            },{
                $lookup : {
                    from : fromData,
                    localField : localData,
                    foreignField : foreignData,
                    as : asData
                }
            },{
                $skip : skipData
            },{
                $limit : limitData
            }],
            countData : [{
                $group : {
                    _id: null,
                    count: {
                        $sum : 1
                    }
                }
            }]
        }
    }])
    return data;
}

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
    // x = arr;
    return arr;
}

// playlist less than 1 hour
async function playlist(){
    let songIndex = 0;
    let temp=0;
    let list = []

    let data = await readSong();
    let song = await randomArray(data);
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
        list.push(song[i]);         
    }
    return list;
    // let result = await insertPlaylist(name,list)
    // return result;
}