const InvariantError = require('../../exceptions/InvariantError')
const { SongsPayloadSchema } = require('./schema')

const SongsValidator = {
    validatorSongsPayload: (payload) => {
        const validatorResult = SongsPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
};

module.exports = SongsValidator;
