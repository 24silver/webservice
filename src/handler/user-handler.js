const { data } = require('@tensorflow/tfjs-node');
const jwt = require('jsonwebtoken');

const userService = require('../services/user-service');
const ResponseError = require('../exceptions/ResponseError');
const register = async (request, h) => {
    await userService.register(request.payload);

    const response = h.response({
        message: 'user created',
        status: 'success',
    });
    response.code(201);
    return response;
};

const login = async (request, h) => {
    const { token } = await userService.login(request.payload);

    const response = h.response({
        message: 'logged in',
        status: 'success',
    });
    response.code(201);
    response.header('Authorization', `Bearer ${token}`);

    return response;
};

const logout = async (request, h) => {
    const response = h.response({
        message: 'logout in',
        status: 'success',
    });
    response.code(204);
    response.header('Authorization', '');
    return response;
};

module.exports = { register, login, logout };
