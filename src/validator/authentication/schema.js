const Joi = require('joi')

const PostUserPayloadSchema = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().required(),
    fullname: Joi.string().required()
})

const PostAuthenticationPayloadSchema = Joi.object({
    username: Joi.string().max(50).required(),
    password: Joi.string().required(),
})

const UpdateAuthenticationPayloadSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

module.exports = {
    PostUserPayloadSchema,
    PostAuthenticationPayloadSchema,
    UpdateAuthenticationPayloadSchema
};
