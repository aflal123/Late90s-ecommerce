import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drewcfm37',
  api_key: process.env.CLOUDINARY_API_KEY || '557363439637743',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'UT5sUZiLP52Hx-FaLUXJ91zyFZk',
  secure: true,
});

export default cloudinary;

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'late90s'
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}
