const ENV_VARS = process.env;
const config = {
    BASE_URL: ENV_VARS.REACT_APP_BASE_URL || 'http://localhost:4000'
}

module.exports = config;
