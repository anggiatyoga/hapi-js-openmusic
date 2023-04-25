const autoBind = require("auto-bind");
const {mapDBToModelSong} = require("../../utils");

class AlbumsHandler {
    constructor(service, songService, validator) {
        this._service = service;
        this._songService = songService;
        this._validator = validator;

        autoBind(this);
    }

    async postAlbumHandler(request, h) {
        this._validator.validatorAlbumsPayload(request.payload);

        const albumId = await this._service.addAlbum(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                albumId,
            },
        });
        response.code(201);
        return response;
    }

    async getAlbumsByIdHandler(request, h) {
        const { id } = request.params;
        const albums = await this._service.getAlbumById(id);
        const songs = await this._songService.getSongsByAlbumId(id);
        const album = mapDBToModelSong(albums, songs)
        return {
            status: 'success',
            data: {
                album
            }
        }
    }

    async putAlbumByIdHandler(request, h) {
        this._validator.validatorAlbumsPayload(request.payload);
        const { id } = request.params;

        await this._service.editAlbumById(id, request.payload);

        return h.response({
            status: 'success',
            message: 'Album berhasil diperbarui',
        });
    }

    async deleteAlbumByIdHandler(request, h) {
        const  { id } = request.params;
        await this._service.deleteAlbumById(id);

        return h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });
    }
}

module.exports = AlbumsHandler;
