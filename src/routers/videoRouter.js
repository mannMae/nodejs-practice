import express from 'express';
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from '../controllers/videoController';
import { protectorMiddleware, videoUploadMiddleware } from '../middlewares';

export const videoRouter = express.Router();

videoRouter.route('/:id([0-9a-f]{24})').get(watch);
videoRouter
  .route('/:id([0-9a-f]{24})/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter
  .route('/:id([0-9a-f]{24})/delete')
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route('/upload')
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUploadMiddleware.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumb', maxCount: 1 },
    ]),
    postUpload
  );