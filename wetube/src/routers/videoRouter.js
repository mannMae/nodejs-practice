import express from 'express';
import {
  remove,
  watch,
  upload,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from '../controllers/videoController';

export const videoRouter = express.Router();

videoRouter.route('/:id(\\d)').get(watch);
videoRouter.route('/:id(\\d)/edit').get(getEdit).post(postEdit);
videoRouter.route('/upload').get(getUpload).post(postUpload);
