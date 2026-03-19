import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadResumeBuffer(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'hirelens/resumes',
        public_id: `${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        resource_type: 'auto',  // let Cloudinary auto-detect (PDF, DOCX, etc.)
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Converts a Cloudinary raw/auto URL to a browser-viewable inline URL.
 * For PDFs: replaces /raw/upload/ with /image/upload/fl_attachment:false/
 * For others: returns as-is.
 */
export function getInlineUrl(url: string): string {
  if (!url) return url;
  // Convert raw upload URL to inline-viewable by inserting fl_attachment:false flag
  return url
    .replace('/raw/upload/', '/image/upload/fl_attachment:false/')
    .replace('/auto/upload/', '/image/upload/fl_attachment:false/');
}
