import { response } from 'express';
import { videoModel } from '../models/Video';

export const home = async (request, response) => {
  try {
    const videos = await videoModel.find({}).sort({ createAt: 'desc' });
    return response.render('home', { pageTitle: 'Home', videos });
  } catch (error) {
    console.error(error);
    return response.send(error);
  }
};
export const watch = async (request, response) => {
  const { id } = request.params;
  const video = await videoModel.findById(id);
  if (video === null) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }
  return response.render('watch', { pageTitle: `${video.title}`, video });
};
export const getEdit = async (request, response) => {
  const { id } = request.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }
  return response.render('edit', { pageTitle: `Edit "${video.title}"`, video });
};
export const postEdit = async (request, response) => {
  const { id } = request.params;
  const { title, description, hashtags } = request.body;
  const video = await videoModel.exists({ _id: id });
  if (!video) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }

  await videoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: videoModel.formatHashtags(hashtags),
  });
  return response.redirect(`/videos/${id}`);
};
export const getUpload = (request, response) => {
  return response.render('upload', { pageTitle: 'Upload Video' });
};
export const postUpload = async (request, response) => {
  const { path: fileUrl } = request.file;
  const { title, description, hashtags } = request.body;
  try {
    await videoModel.create({
      title,
      description,
      fileUrl,
      hashtags: videoModel.formatHashtags(hashtags),
      createdAt: Date.now(),
    });
    return response.redirect('/');
  } catch (error) {
    console.error(error);
    return response.status(400).render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: error._message,
    });
  }
};
export const search = async (request, response) => {
  const { keyword } = request.query;
  let videos = [];
  if (keyword) {
    videos = await videoModel
      .find({
        title: {
          $regex: new RegExp(keyword, 'i'),
        },
      })
      .sort({ createAt: 'desc' });
  }
  console.log(videos);
  return response.render('search', { pageTitle: 'Search', videos });
};
export const deleteVideo = async (request, response) => {
  const { id } = request.params;
  await videoModel.findByIdAndDelete(id);
  return response.redirect('/');
};
