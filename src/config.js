const ENV_VARS = process.env;
const config = {
    BASE_URL: ENV_VARS.BASE_URL || 'http://localhost:4000'
}

module.exports = config;
