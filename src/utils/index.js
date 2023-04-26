const mapDBToModelSong = function (album, songs) {
    return {
        id: album.id,
        name: album.name,
        year: album.year,
        songs: songs,
    };
};

const mapDBToModelPlaylistSongs = function (playlist, songs) {
    return {
        id: playlist.id,
        name: playlist.name,
        username: playlist.username,
        songs: songs,
    };
};

module.exports = { mapDBToModelSong, mapDBToModelPlaylistSongs }
