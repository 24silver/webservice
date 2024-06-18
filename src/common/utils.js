const { PassThrough } = require('stream');
const ResponseError = require('../exceptions/ResponseError');
const getBufferFromStream = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk);
        });
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on('error', (err) => {
            reject(new ResponseError(error.message, 500));
        });
    });
};
const bufferToStream = (buffer) => {
    const stream = new PassThrough();
    stream.end(buffer);
    return stream;
};

module.exports = { getBufferFromStream, bufferToStream };
