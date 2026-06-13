import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 data URI to Cloudinary.
 * @param {string} dataUri  - e.g. "data:image/png;base64,..."
 * @param {string} publicId - optional, used to overwrite the same asset
 */
export const uploadAvatar = async (dataUri, publicId) => {
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'carbon-coach/avatars',
    public_id: publicId,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return result.secure_url;
};
