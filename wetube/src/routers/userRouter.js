import express from 'express';
import {
  edit,
  finishGithubLogin,
  logout,
  remove,
  see,
  startGithubLogin,
  getEdit,
  postEdit,
} from '../controllers/userController';
import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';

export const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get('/remove', remove);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get(':id', see);
