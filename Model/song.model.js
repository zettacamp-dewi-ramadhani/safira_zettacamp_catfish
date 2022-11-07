const {db, mongoose} = require('../Controller/database');

const songSchema = new mongoose.Schema({
    title : {type : String},
    artist : {type : String},
    album : {type : String},
    genre : {type : String},
    duration : {type : String}
});

const Song = mongoose.model('songs', songSchema);

module.exports = Song;