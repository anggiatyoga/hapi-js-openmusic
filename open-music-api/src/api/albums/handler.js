const autoBind = require("auto-bind");
const {mapDBToModelAlbumSongs} = require("../../utils");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumsHandler {
    constructor(service, songService, storageService, validator) {
        this._service = service;
        this._songService = songService;
        this._validator = validator;
        this._storageService = storageService;

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
        const album = mapDBToModelAlbumSongs(albums, songs)
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

    async postUploadCoverAlbumHandler(request, h) {
        const { cover } = request.payload;
        const  { id: albumId } = request.params;

        this._validator.validatorImageHeaders(cover.hapi.headers);

        const filename = await this._storageService.writeCoverIImage(cover, albumId, cover.hapi);
        if (!filename) {
            throw new InvariantError(validationResult.error.message);
        }
        const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

        await this._service.editAlbumById(albumId, { cover: fileLocation });

        const response = h.response({
            status: 'success',
            message: "Sampul berhasil diunggah",
        });
        response.code(201);
        return response;
    }

    async postLikeAlbumHandler(request, h) {
        const  { id } = request.params;

        await this._service.validateAlbumExist(id);

        const { id: credentialId } = request.auth.credentials;

        await this._service.addLikeAlbum(credentialId, id);

        const response = h.response({
            status: 'success',
            message: "Menyukai album",
        });
        response.code(201);
        return response;
    }

    async deleteLikeAlbumHandler(request, h) {
        const  { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._service.deleteLikeAlbum(credentialId, id);

        return h.response({
            status: 'success',
            message: "Batal Menyukai album",
        });
    }

    async getLikesAlbumHandler(request, h) {
        const { id: albumId } = request.params;
        await this._service.validateAlbumExist(albumId);
        let total = await this._service.getLikesAlbumCache(albumId);

        if (!total || total === 0) {
            total = await this._service.getLikesAlbumDb(albumId);
            return h.response({
                status: 'success',
                data: {
                    likes: Number(total),
                },
            });
        }

        const response = h.response({
            status: 'success',
            data: {
                likes: Number(total),
            },
        });
        response.header('X-Data-Source', 'cache');
        return response;
    }



}

module.exports = AlbumsHandler;
