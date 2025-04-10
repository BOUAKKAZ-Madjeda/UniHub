export const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Remplace par ton upload preset

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dn92a1zyb/image/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        return data.secure_url; // URL sécurisée de l'image
    } catch (error) {
        console.error("Erreur lors de l'upload Cloudinary :", error);
        return null;
    }
};
