const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([150, 150])
      .div(tf.scalar(255))
      .expandDims(axis=0)
      .toFloat()
      
      

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;
    const classResult = await tf.argMax(prediction, 1).dataSync();
    let label, nama, bahan, benefit, usage;
    if (classResult[0]==2) {
      label = "Berminyak"
      nama = 'Neutrogena Oil-Free Acne Wash'
      bahan = 'Salicylic Acid (2%) Water, Cocamidopropyl Betaine, Sodium C14-16 Olefin Sulfonate'
      benefit = 'Menghilangkan minyak berlebih di kulit, Membantu mencegah jerawat, Membersihkan pori-pori secara mendalam'
      usage = 'Basahi wajah dan oleskan produk ke tangan. Pijat lembut ke seluruh wajah, hindari area mata. Bilas hingga bersih dan keringkan.'
      
    }
  
    else if(classResult[0]==1){
      label = "Kering"
      nama = 'Cetaphil Moisturizing Cream'
      bahan = 'Water, Glycerin, Petrolatum, Dimethicone'
      benefit = 'Melembapkan kulit kering secara intensif, Membantu memperbaiki penghalang kelembapan alami kulit, Menenangkan kulit yang iritasi dan pecah-pecah'
      usage = 'Oleskan krim pada kulit yang bersih. Pijat lembut hingga meresap sempurna. Gunakan dua kali sehari, pagi dan malam, atau sesuai kebutuhan.'
    }
    else{
      label = "Normal"
      
    }

    return { confidenceScore, label, nama, bahan, benefit, usage };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;
