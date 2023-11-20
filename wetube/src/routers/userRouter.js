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

export const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.route('/edit').get(getEdit).post(postEdit);
userRouter.get('/remove', remove);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);
userRouter.get(':id', see);
