const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const validate = require('../validation/validate.js');
const {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation,
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

    user.image_url =
        'https://storage.googleapis.com/assets-webskinenthusiast/profile-image/user_default.png';

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
    const payload = {
        sub: user.id,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    return {
        token,
    };
}

async function get(id, email) {
    const isUserExist = await prismaClient.user.count({ where: { id } });

    if (!isUserExist) {
        throw new ResponseError('User not exist', 404);
    }

    return prismaClient.user.findFirst({
        where: {
            email: email,
        },
        select: {
            id: true,
            email: true,
            gender: true,
            image_url: true,
            name: true,
        },
    });
}

async function update(data) {
    const user = validate(updateUserValidation, data);
    const userData = await prismaClient.user.count({
        where: {
            id: user.id,
        },
    });

    if (!userData) {
        throw new ResponseError('User is not found', 404);
    }

    if (user?.email) {
        const isEmailExist = await prismaClient.user.count({
            where: {
                email: user.email,
            },
        });

        if (isEmailExist === 1) {
            throw new ResponseError('Email already exist', 409);
        }
    }

    if (user?.password) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    return prismaClient.user.update({
        data: {
            ...user,
        },
        where: {
            id: user.id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            gender: true,
            image_url: true,
        },
    });
}

module.exports = { register, login, get, update };
