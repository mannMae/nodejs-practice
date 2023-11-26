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
  getChangePassword,
  postChangePassword,
} from '../controllers/userController';
import {
  avatarUploadMiddleware,
  protectorMiddleware,
  publicOnlyMiddleware,
} from '../middlewares';

export const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUploadMiddleware.single('avatar'), postEdit);
userRouter.get('/remove', remove);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
userRouter.get(':id', see);
