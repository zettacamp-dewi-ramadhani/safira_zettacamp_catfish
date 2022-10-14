let songList = [
    // 1
    {
        "titile" : "Bad Habits",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "3.50"
    },
    {
        "titile" : "Overpass Graffiti",
        "artist" : "Ed Sheeran",
        "album" : "Equal",
        "genre" : "Pop",
        "duration" : "3.56"
    },
    // 2
    {
        "titile" : "Lovesick Girls",
        "artist" : "Blackpink",
        "album" : "The Album",
        "genre" : "K-pop",
        "duration" : "4.12"
    },
    // 3
    {
        "titile" : "Grand Escape",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "5.39"
    },
    // 4
    {
        "titile" : "Clarity",
        "artist" : "Zedd, Foxes",
        "album" : "Clarity",
        "genre" : "Dance",
        "duration" : "4.31"
    },
    // 5
    {
        "titile" : "Firework",
        "artist" : "Katy Perry",
        "album" : "Teenage Dream",
        "genre" : "Pop",
        "duration" : "3.47" 
    },
    // 6
    {
        "titile" : "I Can't Stop Me",
        "artist" : "TWICE",
        "album" : "Eyes Wide Open",
        "genre" : "K-pop",
        "duration" : "30.25"
    },
    // 7
    {
        "titile" : "Pretender",
        "artist" : "Hige DANdism",
        "album" : "Traveler",
        "genre" : "J-Pop",
        "duration" : "5.26"
    },
    // 8
    {
        "titile" : "Heroes (we could be)",
        "artist" : "Alesso, Tove Lo",
        "album" : "Forever",
        "genre" : "Dance",
        "duration" : "30.30",
    },
    // 9
    {
        "titile" : "Unconditionally",
        "artist" : "Katy Perry",
        "album" : "PRISM",
        "genre" : "Pop",
        "duration" : "3.48" 
    },
    // 10
    {
        "titile" : "Ready For Love",
        "artist" : "Blackpink",
        "album" : "Born Pink",
        "genre" : "K-pop",
        "duration" : "3.04"
    },
    {
        "titile" : "More & More",
        "artist" : "TWICE",
        "album" : "More & More",
        "genre" : "K-pop",
        "duration" : "3.19"
    },
    {
        "titile" : "XOXO",
        "artist" : "Jeon Somi",
        "album" : "XOXO",
        "genre" : "K-pop",
        "duration" : "3.27"
    },
    // 11
    {
        "titile" : "Celebration",
        "artist" : "RADWIMPS, Toko Miura",
        "album" : "Tenki no Ko (complete version)",
        "genre" : "J-Pop",
        "duration" : "4.34"
    },
    // 12
    {
        "titile" : "In the Name of Love",
        "artist" : "Martin Garrix, Bebe Rexha",
        "album" : "In the Name of Love",
        "genre" : "Dance",
        "duration" : "3.15",
    }
];

// group based artist
function artist(artist){
    const artistGroup = songList.filter(song => song.artist == artist);
    console.log("---------------Song List of " + artist + "---------------");
    console.log(artistGroup);
}

// group based genre
const genreGroup = songList.reduce((group, song) => {
    const {genre} = song;
    group[genre] = group[genre] || [];
    group[genre].push(song);
    return group;
}, {});

// playlist less than 1 hour
function playlist(){
    let songIndex = 0;
    let temp=0;

    for (let i = 0; i < songList.length; i++) {
        time = songList[i].duration.split(".");
        let menit = parseInt(time[0])*60;        
        let detik = parseInt(time[1])*1;
        temp = temp + (menit+detik); 
        if(temp < 3600){
            songIndex++;
        }
    }

    for (let i = 0; i < songIndex; i++) {
       console.log(songList[i]);        
    }
}

artist("Blackpink");
console.log("\n---------------Song List Based of Genre---------------");
console.log(genreGroup);
console.log("\n---------------Playlist Less than 1 hour---------------");
playlist()