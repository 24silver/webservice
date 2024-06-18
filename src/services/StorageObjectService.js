const { Storage } = require('@google-cloud/storage');
const { PrismaClient } = require('@prisma/client');
const stream = require('stream');
const path = require('path');
const sharp = require('sharp');

const ResponseError = require('../exceptions/ResponseError');
const pathKey = path.resolve(__dirname, '..', '..', 'serviceaccount.json');

const utils = require('../common/utils');

const prismaClient = new PrismaClient();

async function uploadImage(image, id) {
    // Check type file
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(image.hapi.headers['content-type'])) {
        throw new ResponseError(
            'Invalid file type. Only images are allowed.',
            400
        );
    }

    const storage = new Storage({
        keyFilename: pathKey,
    });

    const bucketName = `assets-webskinenthusiast`;
    const destination = `profile-image/${Date.now()}_${image.hapi.filename}`;

    try {
        // Resize image
        const buffer = await utils.getBufferFromStream(image);
        const resizingImage = await sharp(buffer).resize(500, 500).toBuffer();
        const streamImage = utils.bufferToStream(resizingImage);

        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(destination);

        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                contentType: image.hapi.headers['content-type'],
            },
        });
        const upload = await new Promise((resolve, reject) => {
            streamImage
                .pipe(blobStream)
                .on('finish', () => {
                    resolve({
                        message: 'File uploaded successfully',
                        url: `https://storage.googleapis.com/${bucketName}/${destination}`,
                    });
                })
                .on('error', (error) => {
                    reject(new ResponseError(error.message, 500));
                });
        });

        return prismaClient.user.update({
            where: {
                id,
            },
            data: {
                image_url: upload?.url,
            },
            select: {
                image_url: true,
            },
        });
    } catch (error) {
        // Development code
        throw new ResponseError(error.message, 500);

        // Deployment code
        // throw new ResponseError("Something went wrong, try again", 500);
    }
}

module.exports = uploadImage;
