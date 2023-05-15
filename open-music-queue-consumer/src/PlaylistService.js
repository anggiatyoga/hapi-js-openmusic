const { Pool } = require('pg');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistById(playlistId) {
        const query = {
            text: 'SELECT p.id, p.name, u.username FROM playlist p join users u on p.owner = u.id WHERE p.id = $1',
            values: [playlistId],
        };

        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getSongsPlaylists(playlistId) {
        const query = {
            text: 'SELECT s.id, s.title, s.performer FROM playlist_songs JOIN song s ON s.id = playlist_songs.song_id WHERE playlist_id = $1 GROUP BY s.id',
            values: [playlistId],
        }

        const result = await this._pool.query(query);

        return result.rows;
    }
}

module.exports = PlaylistService;
