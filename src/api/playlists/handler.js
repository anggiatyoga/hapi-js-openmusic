const autoBind = require("auto-bind")
const {mapDBToModelPlaylistSongs} = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsHandler {
    constructor(playlistsService, playlistActService, collaborationsService, validator) {
        this._playlistsService = playlistsService;
        this._playlistActService = playlistActService;
        this._collaborationsService = collaborationsService;
        this._validator = validator;

        autoBind(this);
    }

    async postPlaylistsHandler(request, h) {
        this._validator.validatorPlaylistsPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { name } = request.payload;
        const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

        const response = h.response({
            status: 'success',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request, h) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylists(credentialId);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request, h) {
        const  { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(id, credentialId);
        await this._playlistsService.deletePlaylistById(id);

        return h.response({
            status: 'success',
            message: 'Playlist berhasil dihapus',
        });
    }

    async postPlaylistSongByIdHandler(request, h) {
        this._validator.validatorPlaylistSongPayload(request.payload);

        const  { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this.verifyPlaylistAccess(playlistId, credentialId);

        const { songId } = request.payload;
        await this._playlistsService.validateSongsExist(songId);

        await this._playlistsService.addSongToPlaylists(playlistId, songId);

        await this._playlistActService.addPlaylistSongActivities(playlistId, songId, credentialId, 'add');

        const response = h.response({
            status: 'success',
            message: 'lagu berhasil ditambkan ke playlist',
        });
        response.code(201);
        return response;
    }

    async getPlaylistSongsByIdHandler(request, h) {
        const  { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this.verifyPlaylistAccess(playlistId, credentialId);

        const playlistInfo = await this._playlistsService.getPlaylistsById(playlistId);
        const songs = await this._playlistsService.getSongsPlaylists(playlistId);
        const playlist = mapDBToModelPlaylistSongs(playlistInfo, songs);

        return h.response({
            status: 'success',
            data: {
                playlist,
            },
        });
    }

    async deletePlaylistSongHandler(request, h) {
        this._validator.validatorPlaylistSongPayload(request.payload);

        const  { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        const { songId } = request.payload;

        await this.verifyPlaylistAccess(playlistId, credentialId);

        await this._playlistsService.deleteSongInPlaylist(playlistId, songId);

        await this._playlistActService.addPlaylistSongActivities(playlistId, songId, credentialId, 'delete');

        return h.response({
            status: 'success',
            message: 'Lagu di playlist berhasil dihapus',
        });
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async getPlaylistActivitiesByIdHandler(request, h) {
        const  { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this.verifyPlaylistAccess(playlistId, credentialId);
        const activities = await this._playlistActService.getPlaylistSongActivities(playlistId);

        return h.response({
            status: 'success',
            data: {
                playlistId: playlistId,
                activities: activities,
            },
        });
    }

}

module.exports = PlaylistsHandler;
