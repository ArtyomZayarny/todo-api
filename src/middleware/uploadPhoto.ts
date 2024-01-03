import { upload } from '../multer/index.ts';

export const uploadPhoto = () => upload.single('image');
