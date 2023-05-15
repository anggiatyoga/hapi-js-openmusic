const redis = require('redis');
require("../../exceptions/InvariantError");
const { config } = require("../../utils");

class CacheService {
    constructor() {
        this._client = redis.createClient(config.redis);

        this._client.on('error', (error) => {
            console.error(error);
        });

        this._client.connect();
    }

    async get(key) {
        try {
            return await this._client.get(key);
        } catch (error) {
            return null;
        }
    }

    async set(key, value, expirationInSecond = 1800) {
        await this._client.set(key, value, {
            EX: expirationInSecond,
        });
    }

    delete(key) {
        return this._client.del(key);
    }

}

module.exports = CacheService;
