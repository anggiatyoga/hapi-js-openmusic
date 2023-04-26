const InvariantError = require('../../exceptions/InvariantError');
const { PostPlaylistsPayloadSchema, PostPlaylistSongPayloadSchema } = require("./schema");


const PlaylistsValidator = {
    validatorPlaylistsPayload: (payload) => {
        const validatorResult = PostPlaylistsPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
    validatorPlaylistSongPayload: (payload) => {
        const validatorResult = PostPlaylistSongPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
};

module.exports = PlaylistsValidator;
