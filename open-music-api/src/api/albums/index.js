const AlbumsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'albums',
    version: '1.1.0',
    register: async (server, { service, songService, storageService, validator }) => {
        const albumsHandler = new AlbumsHandler(service, songService, storageService, validator);
        server.route(routes(albumsHandler));
    }
}
