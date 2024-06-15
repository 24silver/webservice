const ClientError = require('../exceptions/ClientError');

class ResponseError extends ClientError {
    constructor(message, status = 400) {
        super(message);
        this.name = 'ResponseError';
        this.statusCode = status;
    }
}

module.exports = ResponseError;
