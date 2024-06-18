const mysql = require('mysql');
const postPredictHandler = require('../handler/handler');
const userHandler = require('../handler/user-handler');

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
