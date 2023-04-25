const mapDBToModelSong = function (album, songs) {
    return {
        id: album.id,
        name: album.name,
        year: album.year,
        songs: songs,
    };
};

module.exports = { mapDBToModelSong }
