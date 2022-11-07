const {
    authJwt
} = require('../Controller/auth');

const {
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
} = require('../Controller/function');

const resolvers = {
    Query : {
        getAllUsers,
        getAllSongs,
        getAllPlaylist
    },

    Mutation : {
        signUp,
        login,
        insertSong,
        updateDurationSong,
        deleteSong,
        insertPlaylist,
        deletePlaylist
    },

    DetailSong : {
        song_id : getPlaylistLoader
    }
}

module.exports = {resolvers};