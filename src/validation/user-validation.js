const Joi = require('joi');

// name     String
//   email    String @unique
//   role     Role   @default(USER)
//   password String @db.VarChar(255)
const registerUserValidation = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(100).required(),
    role: Joi.string().valid('USER', 'ADMIN').optional(),
    password: Joi.string().min(8).max(100).required(),
    gender: Joi.string().valid('MALE', 'FEMALE').required(),
});

const loginUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
});

const updateUserValidation = Joi.object({
    id: Joi.string().required(),
    email: Joi.string().email().optional(),
    name: Joi.string().min(3).max(100).optional(),
    role: Joi.string().valid('USER', 'ADMIN').optional(),
    password: Joi.string().min(8).max(100).optional(),
    gender: Joi.string().valid('MALE', 'FEMALE').optional(),
});

module.exports = {
    registerUserValidation,
    loginUserValidation,
    updateUserValidation,
};
