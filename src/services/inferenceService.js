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
    if (classResult[0]==1) {
      label = 'dry skin'
      nama = 'Moisturizer Avoskin Your Skin Bae GCT Aqua Ceramide'
      bahan = 'Water, Glycerin, Propanediol, 1,2-Hexanediol, Pentylene Glycol, Dicaprylyl Carbonate, Butylene Glycol, Glyceryl Acrylate/Acrylic Acid Copolymer, Leuconostoc/Radish Root Ferment Filtrate, Lactobacillus/Soybean Ferment Extract, Lactobacillus Ferment, Lactobacillus/Acerola Cherry Ferment, Lactococcus Ferment, Bifida Ferment Filtrate, Lactococcus Ferment Lysate, Lactobacillus/Punica Granatum Fruit Ferment Extract, Lactobacillus Ferment Lysate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Caprylic/Capric Triglyceride, Tromethamine, Glucose, Chlorella Vulgaris Extract, Sodium Polyglutamate, Sodium Hyaluronate, Fructose, Hydrogenated Lecithin, Fructooligosaccharides, Ethylhexylglycerin, Ceramide NP, Sodium Phytate, Hyaluronic Acid, Hydrolyzed Hyaluronic Acid, Tocopherol, Phenoxyethanol.'
      benefit = 'This moisturizer has a blend of Aqua Ceramide, Multi Probiome, and Hyaluronic Acidthat is effective for treating dry and dehydrated skin. The Aqua Ceramide content in this product can help maintain moisture for longer, maintain the skin barrier, and can act to soothe the skin.'
      usage = 'Use once every day'
      
    }
  
    else if(classResult[0]==0){
      label = 'acne prone'
      nama = 'Avoskin Your Skin Bae Salicylic Acid'
      bahan = 'Water, Glycerin, Butylene Glycol, Salicylic Acid, Hydroxyethyl Cellulose, Biosaccharide Gum-1, Polysorbate-20, Zinc PCA, Sodium Benzoate, Disodium EDTA, Melaleuca Alternifolia (Tea Tree) Leaf Extract, Tocopheryl Acetate, Sodium Bisulfite, Propylene Glycol.'
      benefit = 'treats acne-prone and blackheaded skin. Contains 2% Salicylic Acid and Zinc which work as exfoliators to clean dead skin cells into the pores and maintain oil production in the skin. The combination of these two ingredients also serves to limit the proliferation of bacteria that cause acne.'
      usage = 'Use once every two days'
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
