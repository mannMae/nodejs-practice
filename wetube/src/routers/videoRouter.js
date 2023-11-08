import express from 'express';
import {
  remove,
  watch,
  upload,
  getEdit,
  postEdit,
} from '../controllers/videoController';

export const videoRouter = express.Router();

videoRouter.get('/:id(\\d)', watch);
videoRouter.route('/:id(\\d)/edit').get(getEdit).post(postEdit);
