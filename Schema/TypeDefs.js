const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Users {
        _id : ID,
        username : String,
        password : String
    }

    type AuthLoad {
        token : String,
        user : Users
    }

    input AuthInput{
        username : String,
        password : String
    }

    type Songs {
        _id : ID,
        title : String,
        artist : String,
        album : String,
        genre : String,
        duration : String
    }

    input InputSong {
        title : String,
        artist : String,
        album : String,
        genre : String,
        duration : String
    }

    input DurationSong {
        id : ID,
        duration : String
    }

    input DeleteData {
        id : ID
    }

    input Paging {
        page : Int,
        limit : Int
    }

    type DetailSong {
        song_id : Songs,
        added_date : String
    }

    type Playlist {
        playlist : String,
        song_ids : [DetailSong],
        created_at : String,
        updated_at : String
    }

    input inputDetailSong {
        song_id : ID
    }

    input InputPlaylist {
        playlist : String,
        song_ids : [inputDetailSong],
    }

    type Query {
        getAllUsers : [Users],
        getAllSongs(input : Paging) : [Songs]
        getAllPlaylist(input : Paging) : [Playlist]
    }

    type Mutation {
        signUp(input : AuthInput) : Users,
        login(input : AuthInput) : AuthLoad,
        insertSong(input: InputSong) : Songs,
        updateDurationSong(input : DurationSong) : Songs,
        deleteSong(input: DeleteData) : Songs,
        deletePlaylist(input: DeleteData) : Playlist,
        insertPlaylist(input : InputPlaylist) : Playlist
    }
`

module.exports = {typeDefs};