const {db, mongoose} = require('../Controller/database');

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
});

const SongPlaylist = mongoose.model('playlists', playlistSchema);

module.exports = SongPlaylist;