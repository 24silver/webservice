const mysql = require('mysql');
const postPredictHandler = require('../handler/handler');
const userHandler = require('../handler/user-handler');
const uploadHandler = require('../handler/upload-handler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
            },
            auth: 'default',
        },
    },
    {
        path: '/login',
        method: 'POST',
        handler: userHandler.login,
    },
    {
        path: '/register',
        method: 'POST',
        handler: userHandler.register,
    },
    {
        path: '/account',
        method: 'GET',
        handler: userHandler.getData,
        options: {
            auth: 'default',
        },
    },
    {
        path: '/account',
        method: 'POST',
        handler: userHandler.updateData,
        options: {
            auth: 'default',
        },
    },
    {
        path: '/logout',
        method: 'DELETE',
        handler: userHandler.logout,
        options: {
            auth: 'default',
        },
    },

    // TODO test upload image

    {
        path: '/upload/image',
        method: 'POST',
        handler: uploadHandler.upload,
        options: {
            payload: {
                output: 'stream',
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024,
            },
            auth: 'default',
        },
    },

    {
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return h
                .response({
                    message: 'failed',
                    status: '404 Error! Page Not Found!',
                })
                .code(404);
        },
    },
];

module.exports = routes;
