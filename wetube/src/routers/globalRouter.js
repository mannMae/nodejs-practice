import express from 'express';
import { join, login } from '../controllers/userController';
import { search, trending } from '../controllers/videoController';

export const globalRouter = express.Router();

globalRouter.get('/', trending);
globalRouter.get('/join', join);
globalRouter.get('/login', login);
globalRouter.get('/search', search);
