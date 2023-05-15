const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: handler.postAlbumHandler,
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: handler.getAlbumsByIdHandler,
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: handler.putAlbumByIdHandler
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: handler.deleteAlbumByIdHandler,
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadCoverAlbumHandler,
        options: {
            payload: {
                maxBytes: 512000,
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
            },
        },
    },
    {
        method: 'GET',
        path: '/albums/images/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'cover/images'),
            },
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: handler.postLikeAlbumHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: handler.deleteLikeAlbumHandler,
        options: {
            auth:'open-music-app_jwt'
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: handler.getLikesAlbumHandler,
    },

]

module.exports = routes;
