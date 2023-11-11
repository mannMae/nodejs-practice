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

videoRouter.route('/:id([0-9a-f]{24})').get(watch);
videoRouter.route('/:id([0-9a-f]{24})/edit').get(getEdit).post(postEdit);
videoRouter.route('/upload').get(getUpload).post(postUpload);
