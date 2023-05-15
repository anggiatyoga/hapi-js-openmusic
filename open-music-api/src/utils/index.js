const mapDBToModelAlbumSongs = function (album, songs) {
    return {
        id: album.id,
        name: album.name,
        year: album.year,
        coverUrl: album.cover,
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

const config = {
    app: {
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    },
    rabbitMq: {
        server: process.env.RABBITMQ_SERVER,
    },
    redis: {
        socket: {
            host: process.env.REDIS_SERVER,
        },
    }
}

module.exports = { mapDBToModelAlbumSongs, mapDBToModelPlaylistSongs, config }
