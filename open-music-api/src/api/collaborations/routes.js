const routes = (handler) => [
    {
        method: 'POST',
        path: '/collaborations',
        handler: handler.postCollaborationHandler,
        options: {
            auth: 'open-music-app_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: handler.deleteCollaborationHandler,
        options: {
            auth: 'open-music-app_jwt',
        },
    },
];

module.exports = routes;
