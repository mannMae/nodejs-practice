import { response } from 'express';
import { videoMoel } from '../models/Video';

const videos = [
  {
    title: 'FirstVideo',
    rating: 5,
    comments: 3,
    createdAt: '5 minutes ago',
    views: 34,
    id: 1,
  },
  {
    title: 'SecondVideo',
    rating: 5,
    comments: 3,
    createdAt: '5 minutes ago',
    views: 34,
    id: 2,
  },
  {
    title: 'ThirdVideo',
    rating: 5,
    comments: 3,
    createdAt: '5 minutes ago',
    views: 34,
    id: 3,
  },
  {
    title: 'ForthVideo',
    rating: 5,
    comments: 3,
    createdAt: '5 minutes ago',
    views: 1,
    id: 4,
  },
];

export const home = async (request, response) => {
  try {
    const videos = await videoMoel.find({});
    return response.render('home', { pageTitle: 'Home', videos });
  } catch (error) {
    console.error(error);
    return response.send(error);
  }
};
export const watch = (request, response) => {
  const { id } = request.params;
  const video = videos.find((v) => String(v.id) === id);
  return response.render('watch', { pageTitle: `${video.title}`, video });
};
export const getEdit = (request, response) => {
  const { id } = request.params;
  const video = videos.find((v) => String(v.id) === id);
  return response.render('edit', { pageTitle: `Edit "${video.title}"`, video });
};
export const postEdit = () => {
  const { id } = request.params;
  const { title } = request.body;
  return response.redirect(`/videos/${id}`);
};
export const getUpload = (request, response) => {
  response.render('upload', { pageTitle: 'Upload Video' });
};
export const postUpload = (request, response) => {
  const { title } = request.body;
  const newVideo = {
    title,
    rating: 0,
    comments: 0,
    createdAt: Date.now(),
    views: 0,
    id: videos.length + 1,
  };
  return response.redirect('/');
};
export const search = (request, response) => response.send('Search');
export const remove = (request, response) => response.send('Delete');
