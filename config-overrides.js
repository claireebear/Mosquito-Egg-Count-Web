// config-overrides.js
const path = require('path');

module.exports = function override(config, env) {
    // Add polyfills for Node.js core modules
    config.resolve.fallback = {
        path: require.resolve('path-browserify'),
        fs: require.resolve('fs-browserify'),
    };

    return config;
};
