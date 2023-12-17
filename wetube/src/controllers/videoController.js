import { response } from 'express';
import { videoModel } from '../models/Video';
import { userModel } from '../models/User';

export const home = async (request, response) => {
  try {
    const videos = await videoModel
      .find({})
      .sort({ createAt: 'desc' })
      .populate('owner');
    return response.render('home', { pageTitle: 'Home', videos });
  } catch (error) {
    console.error(error);
    return response.send(error);
  }
};
export const watch = async (request, response) => {
  const { id } = request.params;
  ``;
  const video = await videoModel.findById(id).populate('owner');
  if (video === null) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }
  return response.render('watch', {
    pageTitle: `${video.title}`,
    video,
    owner: video.owner,
  });
};
export const getEdit = async (request, response) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = request;
  const video = await videoModel.findById(id);
  if (!video) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }
  if (String(video.owner) !== String(_id)) {
    return response.status(403).redirect('/');
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
  const {
    session: {
      user: { _id },
    },
    file: { path: fileUrl },
    body: { title, description, hashtags },
  } = request;
  try {
    const newVideo = await videoModel.create({
      title,
      description,
      fileUrl,
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
      createdAt: Date.now(),
    });
    const user = await userModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
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
      .populate('owner')
      .sort({ createAt: 'desc' });
  }
  return response.render('search', { pageTitle: 'Search', videos });
};
export const deleteVideo = async (request, response) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = request;
  const video = await videoModel.findById(id);
  if (!video) {
    return response.status(404).render('404', { pageTitle: 'Video not found' });
  }
  if (String(video.owner !== String(_id))) {
    return response.status(403).redirect('/');
  }
  await videoModel.findByIdAndDelete(id);
  return response.redirect('/');
};

export const registerView = async (request, response) => {
  const { id } = request.params;
  const video = await videoModel.findById(id);
  if (!video) {
    return response.sendStatus(404);
  }
  console.log(video.meta.views);
  if (!video.meta.views) {
    video.meta.views = 1;
  } else {
    video.meta.views = video.meta.views + 1;
  }
  await video.save();
  return response.sendStatus(200);
};
