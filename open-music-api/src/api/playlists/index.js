const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name : 'playlist',
    version : '1.0.0',
    register: async (server, { playlistsService, playlistActService, collaborationsService, validator }) => {
        const playlistHandler = new PlaylistsHandler(playlistsService, playlistActService, collaborationsService, validator);
        server.route(routes(playlistHandler))
    },
};
