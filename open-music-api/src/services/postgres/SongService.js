const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require("../../exceptions/NotFoundError");

class SongService {
    constructor() {
        this._pool = new Pool();
    }

    async addSong({title, year, genre, performer, duration, albumId}) {
        const id = `song-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO song VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
            values: [id, title, year, genre, performer, duration, albumId, timeNow],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Song gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs(title, performer) {
        const query = {
            text: 'SELECT id, title, performer FROM song where title ilike $1 and performer ilike $2 ',
            values: [`%${title}%`, `%${performer}%`]
        }

        const result = await this._pool.query(query);

        return result.rows;
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT * FROM song WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song tidak ditemukan');
        }

        return result.rows[0];
    }

    async getSongsByAlbumId(albumId) {
        const query = {
            text: 'SELECT id, title, performer FROM song WHERE album_id = $1',
            values: [albumId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async editSongById(id, {title, year, genre, performer, duration, albumId}) {
        const timeNow = new Date().toISOString();
        const query = {
            text: 'UPDATE song SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id= $6, updated_at = $7 WHERE id = $8 RETURNING id',
            values: [title, year, genre, performer, duration, albumId, timeNow, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM song WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = SongService;
