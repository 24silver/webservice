const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');


async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { confidenceScore, label, nama, bahan, benefit, usage } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  // const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    'nama' : nama, 
    'bahan' : bahan , 
    'benefit': benefit, 
    'usage' : usage
  }

 

  const response = h.response({
    status: 'success',
    message: 'gambar dapat diproses',
    data
  })
  response.code(201);
  return response;
}

module.exports = postPredictHandler;
