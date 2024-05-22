const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;
    let suggestion, label;

    if (score<0.5) {
      label = "Non-cancer"
      suggestion = "medical checkup berkala"
    }
  
    else {
      label = "Cancer"
      suggestion = "Segera konsultasi dengan dokter terdekat untuk meminimalisasi penyebaran kanker."
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
