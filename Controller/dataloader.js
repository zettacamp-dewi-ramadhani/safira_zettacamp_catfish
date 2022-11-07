const DataLoader = require('dataloader');
const Song = require('../Model/song.model');

const songLoader = async(songId)=>{
    const songList = await Song.find({
        _id: {
            $in : songId
        }
    });
    return songList;
}

const playlistLoader = new DataLoader(songLoader);
module.exports = playlistLoader;