require('dotenv').config();

const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');
const util = require('util');
const mysql = require('mysql');

const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');
const ResponseError = require('../exceptions/ResponseError');
const scheme = require('./authentication-schema');

(async () => {
    const server = Hapi.server({

        port: process.env.PORT || 3000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    const model = await loadModel();
    server.app.model = model;

    server.auth.scheme('custom', scheme);
    server.auth.strategy('default', 'custom');

    server.route(routes);

    server.ext('onPreResponse', function (request, h) {
        const response = request.response;
        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `Terjadi kesalahan dalam melakukan prediksi`,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response instanceof ResponseError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        if (response.isBoom) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();
