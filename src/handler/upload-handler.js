const uploadImage = require('../services/StorageObjectService');

const upload = async (request, h) => {
    const { token } = request.auth.credentials;
    const { image } = request.payload;

    const result = await uploadImage(image, token.sub);

    console.log(result);

    const response = h.response({
        message: 'success upload image data',
        status: 'success',
        data: {
            id: token.sub,
            ...result,
        },
    });
    response.code(200);
    return response;
};

module.exports = { upload };
