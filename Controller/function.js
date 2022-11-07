const User = require('../Model/user.model');
const Song = require('../Model/song.model');
const SongPlaylist = require('../Model/playlist.model');
// const {authJwt} = require('./auth');
const jwt = require('jsonwebtoken');
const tokenSecret = 'secret';

const signUp = async(parent, {input: {username, password}})=>{
    let user = new User({
        username : username,
        password : password
    });
    await user.save();
    return {
        _id : user._id,
        username : user.username
    };
}

const login = async(parent, {input: {username, password}}, ctx)=>{
    let user = await User.findOne({
        username :  username,
        password : password
    });
    if(!user){
        throw new ctx.error("User not found")
    }else{
    const token = jwt.sign({
        userId : user._id
    }, tokenSecret);
    return {
        token,
        user : {
            _id : user._id,
            username : user.username
        }
    }
}
}

const getAllUsers = async()=>{
    let result = await User.find();
    return result;
}

const getAllSongs = async(parent, {input: {page,limit}})=>{
    let result = await Song.aggregate([{
        $skip : page*limit
    },{
        $limit : limit
    }]);
    console.log(result);
    return result;
}

const getAllPlaylist = async(parent, {input: {page,limit}})=>{
    let result = await SongPlaylist.aggregate([{
        $skip : page*limit
    },{
        $limit : limit
    }]);
    return result;
}

const getPlaylistLoader = async(parent, args, ctx)=>{
    if(parent.song_id){
        const result = await ctx.playlistLoader.load(parent.song_id);
        console.log(result)
        return result
    }
}

const insertSong = async (parent, {input: {title, artist, album, genre, duration}}) =>{
    let data = new Song({
        title : title,
        artist : artist,
        album : album,
        genre : genre,
        duration : duration
    })
    await data.save();
    return data;
};

const insertPlaylist = async(parent, {input : {playlist, song_ids}})=>{
    let data = new SongPlaylist({
        playlist : playlist,
        song_ids : song_ids
    })
    await data.save();
    console.log(data)
    return data;
}

const updateDurationSong = async(parent, {input: {id, duration}})=>{
    console.log(id)
    let data = await Song.findByIdAndUpdate({
        _id : id
    },{
        $set :{
        duration : duration}
    })
    return data;
}

const deleteSong = async(parent, {input : {id}})=>{
    let data = await Song.findByIdAndDelete({
        _id : id
    })
    console.log(data);
    return data;
}

const deletePlaylist = async(parent, {input : {id}})=>{
    let data = await Song.findByIdAndDelete({
        _id : id
    })
    console.log(data);
    return data;
}

module.exports = {
    signUp,
    login,
    getAllUsers,
    getAllSongs,
    getAllPlaylist,
    getPlaylistLoader,
    insertSong,
    updateDurationSong,
    deleteSong,
    insertPlaylist,
    deletePlaylist
};