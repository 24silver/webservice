const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const validate = require('../validation/validate.js');
const {
    registerUserValidation,
    loginUserValidation,
} = require('../validation/user-validation.js');
const ResponseError = require('../exceptions/ResponseError.js');

const prismaClient = new PrismaClient();

async function register(data) {
    // validation input
    const user = validate(registerUserValidation, data);

    // check user is exist?
    const isUserExist = await prismaClient.user.count({
        where: {
            email: user.email,
        },
    });

    if (isUserExist === 1) {
        throw new ResponseError('Email already exists');
    }

    // encrypt password
    user.password = await bcrypt.hash(user.password, 10);

    // create user

    return prismaClient.user.create({
        data: user,
        select: {
            email: true,
            name: true,
        },
    });
}

async function login(data) {
    // validation input
    const request = validate(loginUserValidation, data);

    // find user
    const user = await prismaClient.user.findUnique({
        where: {
            email: request.email,
        },
    });

    // check user is exist?
    if (!user) {
        throw new ResponseError(
            'Invalid email or password. Please try again.',
            400
        );
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(
        request.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ResponseError(
            'Invalid email or password. Please try again.',
            400
        );
    }

    // create token
    const payload = { sub: user.id, email: user.email };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '5m',
    });

    return {
        token,
    };
}

module.exports = { register, login };
