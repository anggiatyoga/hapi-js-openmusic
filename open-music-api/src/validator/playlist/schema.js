const Joi = require('joi')

const PostPlaylistsPayloadSchema = Joi.object({
    name: Joi.string().required()
})

const PostPlaylistSongPayloadSchema = Joi.object({
    songId: Joi.string().required()
})

module.exports = {
    PostPlaylistsPayloadSchema,
    PostPlaylistSongPayloadSchema,
}
