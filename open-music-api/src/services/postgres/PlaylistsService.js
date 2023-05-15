const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylist(name, owner) {
        const id = `playlist-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, owner, timeNow],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: 'SELECT p.id, p.name, u.username FROM playlist p LEFT JOIN collaborations c ON c.playlist_id = p.id LEFT JOIN users u ON u.id = p.owner WHERE p.owner = $1 OR c.user_id = $1',
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async getPlaylistsById(playlistId) {
        const query = {
            text: 'SELECT p.id, p.name, u.username FROM playlist p join users u on p.owner = u.id WHERE p.id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
        }
    }

    async addSongToPlaylists(playlistId, songId) {
        const id = `playlist-song-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, playlistId, songId, timeNow],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Lagu gagal ditambahkan kedalam Playlist');
        }
    }

    async getSongsPlaylists(playlistId) {
        const query = {
            text: 'SELECT s.id, s.title, s.performer FROM playlist_songs JOIN song s ON s.id = playlist_songs.song_id WHERE playlist_id = $1 GROUP BY s.id',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deleteSongInPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Lagu dalam Playlist gagal dihapus. Song Id tidak ditemukan');
        }
    }

    async validateSongsExist(songId) {
        const query = {
            text: 'SELECT EXISTS(SELECT 1 FROM song WHERE id = $1)',
            values: [songId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].exists) {
            throw new NotFoundError('Lagu tidak ada');
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT owner FROM playlist WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const note = result.rows[0];
        if (note.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
}

module.exports = PlaylistsService;
