class Listener {
    constructor(playlistService, mailSender) {
        this._playlistService = playlistService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { playlistId, targetEmail } = JSON.parse(message.content.toString());
            const playlistSongs = await this.getPlaylistSongsById(playlistId);
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistSongs));

            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    async getPlaylistSongsById(playlistId) {
        const playlist = await this._playlistService.getPlaylistById(playlistId);
        const songs = await this._playlistService.getSongsPlaylists(playlistId);
        return {
            playlist: {
                id: playlist.id,
                name: playlist.name,
                songs: songs,
            },
        };
    }

}

module.exports = Listener;
