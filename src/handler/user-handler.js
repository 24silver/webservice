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

const getData = async (request, h) => {
    const { token } = request.auth.credentials;

    const result = await userService.get(token.sub, token.email);

    const response = h.response({
        message: 'success get data',
        status: 'success',
        user: {
            ...result,
        },
    });
    response.code(200);
    return response;
};

const updateData = async (request, h) => {
    const { token } = request.auth.credentials;
    const userDataRequest = request.payload;
    // console.log(token);
    const data = await userService.update({
        id: token.sub,
        ...userDataRequest,
    });

    const response = h.response({
        message: 'success update data',
        status: 'success',
        data,
    });
    response.code(200);

    return response;
};

module.exports = { register, login, logout, getData, updateData };
