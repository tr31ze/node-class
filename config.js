/*
 *  Config
 */

let environments = {};

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
};

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};

//environment check

let currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let envToExport = typeof (environments[currentEnv]) === 'object' ? environments[currentEnv] : environments.staging;

module.exports = envToExport;