require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const AlbumValidator = require('./validator/albums');
const AlbumsService = require('./services/postgres/AlbumsService');

const songs = require('./api/songs');
const SongValidator = require('./validator/songs');
const SongService = require('./services/postgres/SongService');

const authentications = require('./api/authentication');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentication');
const UsersService = require('./services/postgres/UsersService');

const playlist = require('./api/playlists');
const PlaylistsValidator = require('./validator/playlist');
const PlaylistsService = require('./services/postgres/PlaylistsService');

const PlaylistActService = require('./services/postgres/PlaylistsActivitiesService');

const collaborations = require('./api/collaborations');
const CollaborationsValidator = require('./validator/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');

const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const StorageService = require('./services/storage/StorageService');

const CacheService = require('./services/redis/CacheService')

const { config } = require("./utils");

const init = async () => {
    const cacheService = new CacheService();
    const albumsService = new AlbumsService(cacheService);
    const songsService = new SongService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService();
    const playlistActService = new PlaylistActService();
    const collaborationsService = new CollaborationsService();
    const storageService = new StorageService(path.resolve(__dirname, 'api/albums/cover/images'));


    const server = Hapi.server(config.app);

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    server.auth.strategy('open-music-app_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: albums,
            options: {
                service: albumsService,
                songService: songsService,
                storageService: storageService,
                validator: AlbumValidator,
            },
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlist,
            options: {
                playlistsService,
                playlistActService,
                collaborationsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                usersService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                service: ProducerService,
                playlistsService: playlistsService,
                validator: ExportsValidator,
            },
        },
    ]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            console.log(`${request.info.remoteAddress} ${request.path}: ${request.method.toUpperCase()}[${request.response.statusCode}] -> ${request.response.message}`);
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message,
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            if (!response.isServer) {
                return h.continue;
            }

            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami',
            });
            newResponse.code(500);
            return newResponse;
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
