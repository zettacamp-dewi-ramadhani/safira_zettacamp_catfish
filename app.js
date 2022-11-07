const express = require ('express');
const app = express();
const {ApolloServer, ApolloError} = require('apollo-server-express');
const {typeDefs} = require('./Schema/TypeDefs');
const {resolvers} = require('./Schema/Resolvers');
const {applyMiddleware} = require('graphql-middleware');
const authJwt = require('./Controller/auth');
const {makeExecutableSchema} = require('graphql-tools');
const playlistLoader = require('./Controller/dataloader');
const {merge} = require('lodash');

// const auth = merge(authJwt);
let auth = {}

auth = merge(authJwt)

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const protectedSchema = applyMiddleware(executableSchema, auth);

const server = new ApolloServer({
    schema : protectedSchema,
    typeDefs,
    resolvers,
    context : function({
        req
    }){
        req;
        return{
            playlistLoader, req, error : ApolloError
        }
    }
});

server.start().then(res=>{
    server.applyMiddleware({app});
    app.listen(4000,()=>
        console.log('Server Running on Port 4000')
    );
});


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
// function artist(artist){
//     let obj = {};
//     const artistGroup = songList.filter(song => song.artist == artist);
//     const map = new Map;
//     map.set(artist, artistGroup);
//     map.forEach((v,k)=>{
//         obj[k] = v;
//     });
//     return obj;
// }

// // group based genre
// const genreGroup = songList.reduce((group, song) => {
//     const {genre} = song;
//     group[genre] = group[genre] || [];
//     group[genre].push(song);
//     return group;
// }, {});

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