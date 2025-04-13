import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'ydkfkujows',       // ⬅️ Replace with your Cloudinary cloud name
  api_key: '843329453827192',             // ⬅️ Replace with your Cloudinary API key
  api_secret: 'az-9m8h72KbikVwb6orSLi69gOI',       // ⬅️ Replace with your Cloudinary API secret
  secure: true,
});

export default cloudinary;
