const InvariantError = require('../../exceptions/InvariantError');
const { AlbumsPayloadSchema, ImageHeadersSchema} = require('./schema');

const AlbumsValidator = {
    validatorAlbumsPayload: (payload) => {
        const validatorResult = AlbumsPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },

    validatorImageHeaders: (headers) => {
        const validationResult = ImageHeadersSchema.validate(headers);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AlbumsValidator;
