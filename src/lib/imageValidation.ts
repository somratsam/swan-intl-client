export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILES_PER_UPLOAD = 10;

export function validateImageFile(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Only jpg, png and webp images are allowed';
  if (file.size > MAX_FILE_SIZE) return 'File too large — maximum 5MB per image';
  return null;
}

export function validateImageFiles(files: File[], multiple: boolean): string | null {
  if (!multiple && files.length > 1) return 'Only one image is allowed for this field.';
  if (files.length > MAX_FILES_PER_UPLOAD) return 'Too many files — maximum 10 per upload';
  for (const file of files) {
    const err = validateImageFile(file);
    if (err) return err;
  }
  return null;
}
