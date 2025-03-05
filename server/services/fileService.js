import { bucket } from "../utils/firebase.js";
import { ref, deleteObject } from "firebase/storage";

export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(bucket, filePath);
    await deleteObject(fileRef);
    console.log(`Deleted file from Firebase Storage: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file from Firebase: ${filePath}`, error);
  }
};
