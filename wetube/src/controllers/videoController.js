import { response } from 'express';

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

export const trending = (request, response) => {
  return response.render('home', { pageTitle: 'Home', videos });
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
export const search = (request, response) => response.send('Search');
export const upload = (request, response) => response.send('Upload');
export const remove = (request, response) => response.send('Delete');
