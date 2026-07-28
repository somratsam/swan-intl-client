const CLOUDINARY_HOST = 'res.cloudinary.com';
const UPLOAD_MARKER = '/upload/';

type OptimizeImageOptions = {
  width?: number;
};

export function optimizeImage(url: string | undefined | null, options: OptimizeImageOptions = {}): string {
  if (!url) return '';

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname !== CLOUDINARY_HOST) return url;

  const uploadIndex = parsed.pathname.indexOf(UPLOAD_MARKER);
  if (uploadIndex === -1) return url;

  const before = parsed.pathname.slice(0, uploadIndex + UPLOAD_MARKER.length);
  const after = parsed.pathname.slice(uploadIndex + UPLOAD_MARKER.length);

  const transforms = ['f_auto', 'q_auto'];
  if (options.width) transforms.push(`w_${options.width}`);

  parsed.pathname = `${before}${transforms.join(',')}/${after}`;
  return parsed.toString();
}
