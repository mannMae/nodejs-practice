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
export const watch = async (request, response) => {
  const { id } = request.params;
  const video = await videoMoel.findById(id);
  return response.render('watch', { pageTitle: `${video.title}`, video });
};
export const getEdit = async (request, response) => {
  const { id } = request.params;
  const video = await videoMoel.findById(id);
  return response.render('edit', { pageTitle: `Edit "${video.title}"`, video });
};
export const postEdit = () => {
  const { id } = request.params;
  const { title } = request.body;
  return response.redirect(`/videos/${id}`);
};
export const getUpload = (request, response) => {
  return response.render('upload', { pageTitle: 'Upload Video' });
};
export const postUpload = async (request, response) => {
  const { title, description, hashtags } = request.body;
  try {
    await videoMoel.create({
      title,
      description,
      hashtags: hashtags.split(',').map((tag) => `#${tag}`),
      createdAt: Date.now(),
    });
    return response.redirect('/');
  } catch (error) {
    console.error(error);
    return response.render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: error._message,
    });
  }
};
export const search = (request, response) => response.send('Search');
export const remove = (request, response) => response.send('Delete');
