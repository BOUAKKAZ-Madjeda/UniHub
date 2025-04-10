import axios from 'axios';

// Fonction pour télécharger une image vers Cloudinary
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // Assure-toi que le preset est correct
  formData.append('cloud_name', 'dn92a1zyb'); // Assure-toi que le cloud_name est correct

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/dn92a1zyb/image/upload`, formData);
    console.log('Image uploadée avec succès:', response.data.secure_url);
    return response.data.secure_url; // Retourne l'URL de l'image
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    throw new Error('L\'upload de l\'image a échoué.'); // Tu peux aussi gérer ça d'une manière plus spécifique
  }
};
