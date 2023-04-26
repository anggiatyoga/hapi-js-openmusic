const InvariantError = require('../../exceptions/InvariantError')
const {
    PostUserPayloadSchema,
    PostAuthenticationPayloadSchema,
    UpdateAuthenticationPayloadSchema
} = require('./schema')


const AuthenticationValidator = {
    validatorPostUserPayload: (payload) => {
        const validatorResult = PostUserPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
    validatorPostAuthenticationPayload: (payload) => {
        const validatorResult = PostAuthenticationPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
    validatorUpdateAuthenticationPayload: (payload) => {
        const validatorResult = UpdateAuthenticationPayloadSchema.validate(payload);
        if (validatorResult.error) {
            throw new InvariantError(validatorResult.error.message);
        }
    },
};

module.exports = AuthenticationValidator;
