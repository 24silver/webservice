const jwt = require('jsonwebtoken');
const ResponseError = require('../exceptions/ResponseError');

// Auth scheme
const scheme = function (server, options) {
    return {
        authenticate: function (request, h) {
            const { authorization } = request.raw.req.headers;

            if (!authorization) {
                throw new ResponseError(
                    'Access denied. Please provide valid authentication credentials.',
                    401
                );
            }

            const token = authorization.split(' ')[1];

            const isTokenValid = jwt.verify(
                token,
                process.env.JWT_SECRET,
                function (err, decoded) {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            throw new ResponseError('Token is expired', 401);
                        }

                        throw new ResponseError(
                            'Access denied. Please provide valid authentication credentials.',
                            401
                        );
                    }

                    return decoded;
                }
            );

            return h.authenticated({ credentials: { token: isTokenValid } });
        },
    };
};

module.exports = scheme;
