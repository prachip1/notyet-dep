import fs from 'fs/promises';

export const deleteFile = async (filePath) => {
  try {
    await fs.access(filePath); // Check if file exists
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`File not found: ${filePath}`);
    } else {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  }
};
