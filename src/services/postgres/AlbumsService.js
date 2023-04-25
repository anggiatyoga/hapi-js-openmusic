const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({name, year}) {
        const id = `album-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO album VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, year, timeNow],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Albums gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT id, name, year FROM album WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows[0];
    }

    async editAlbumById(id, { name, year }) {
        const timeNow = new Date().toISOString();
        const query = {
            text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, timeNow, id],
        };


        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui albums. Id tidak ditemukan');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM album WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Albums gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = AlbumsService;
