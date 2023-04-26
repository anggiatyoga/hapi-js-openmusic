const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistsActivitiesService {
    constructor() {
        this._pool = new Pool();
    }

    async addPlaylistSongActivities(playlistId, songId, userId, action) {
        const id = `playlist-song-act-${nanoid(16)}`;
        const timeNow = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, playlistId, songId, userId, action, timeNow],
        }

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            const data = {playlistId: playlistId, songId: songId, userId: userId, action: action, time: timeNow};
            console.log('gagal mencatat riwayat lagu di playlist: ', data)
            console.log('failed record history to playlist-song-activities -> ', data)
        }
    }

    async getPlaylistSongActivities(playlistId) {
        const query = {
            text: 'SELECT u.username, s.title, psa.action, psa.time FROM playlist_song_activities psa JOIN playlist p ON p.id = psa.playlist_id JOIN song s on s.id = psa.song_id JOIN users u ON u.id = psa.user_id WHERE p.id = $1',
            values: [playlistId],
        };
        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = PlaylistsActivitiesService;
