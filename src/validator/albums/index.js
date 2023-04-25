const InvariantError = require('../../exceptions/InvariantError')
const { AlbumsPayloadSchema } = require('./schema')

const AlbumsValidator = {
    validatorAlbumsPayload: (payload) => {
        const validatorResult = AlbumsPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
};

module.exports = AlbumsValidator;
