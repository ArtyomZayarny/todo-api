import { Request } from 'express';
import multer from 'multer';

import { AppError } from '../modules/errors/AppError.ts';

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/todos');
  },
  filename: (req, file, cb) => {
    // todo-67676bsdad-33444.jpeg
    const ext = file.mimetype.split('/')[1];
    //@ts-ignore
    cb(null, `todo-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

export const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
