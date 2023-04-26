const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: handler.postPlaylistsHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: handler.getPlaylistsHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: handler.deletePlaylistByIdHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postPlaylistSongByIdHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getPlaylistSongsByIdHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deletePlaylistSongHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: handler.getPlaylistActivitiesByIdHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },

];

module.exports = routes;
