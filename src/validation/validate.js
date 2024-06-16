const ResponseError = require('../exceptions/ResponseError');

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });
    if (result.error) {
        throw new ResponseError(result.error.message);
    } else {
        return result.value;
    }
};

module.exports = validate;
