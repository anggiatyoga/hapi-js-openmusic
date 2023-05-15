const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
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
            text: 'SELECT id, name, year, cover FROM album WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        return result.rows[0];
    }

    async editAlbumById(id, { name, year, cover }) {
        const timeNow = new Date().toISOString();
        let query;
        if (!cover) {
            query = {
                text: 'UPDATE album SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
                values: [name, year, timeNow, id],
            };
        } else {
            query = {
                text: 'UPDATE album SET cover = $1, updated_at = $2 WHERE id = $3 RETURNING id',
                values: [cover, timeNow, id],
            };
        }
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
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

    async addLikeAlbum(userId, albumId) {
        const key = `likes:${albumId}`;
        const id = `likes:${albumId}:${userId}`;

        await this.validateIdLikesExists(id);

        const query = {
            text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
            values: [id, userId, albumId],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Albums gagal ditambahkan');
        }

        await this._cacheService.delete(key);
    }

    async deleteLikeAlbum(userId, albumId) {
        const key = `likes:${albumId}`;
        const id = `likes:${albumId}:${userId}`

        const query = {
            text: 'DELETE FROM user_album_likes WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Batalkan suka pada album gagal. Id tidak ditemukan');
        }

        await this._cacheService.delete(key);
    }

    async getLikesAlbumDb(id) {
        const query = {
            text: 'SELECT COUNT(id) FROM user_album_likes where album_id = $1',
            values: [id],
        }

        const result = await this._pool.query(query);

        await this._cacheService.set(`likes:${id}`, result.rowCount);
        return result.rows[0].count;
    }

    async getLikesAlbumCache(id) {
        return await this._cacheService.get(`likes:${id}`);
    }


    async validateAlbumExist(albumId) {
        const query = {
            text: 'SELECT EXISTS(SELECT 1 FROM album WHERE id = $1)',
            values: [albumId],
        }

        const result = await this._pool.query(query);

        if (!result.rows[0].exists) {
            throw new NotFoundError('Album tidak ada');
        }
    }

    async validateIdLikesExists(id) {
        const query = {
            text: 'SELECT EXISTS(SELECT 1 FROM user_album_likes WHERE id = $1)',
            values: [id],
        }

        const result = await this._pool.query(query);

        if (result.rows[0].exists) {
            throw new InvariantError('Anda sudah menyukai album ini');
        }
    }

}

module.exports = AlbumsService;
