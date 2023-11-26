import multer from 'multer';

export const localsMiddleware = (request, response, next) => {
  response.locals.loggedIn = Boolean(request.session.loggedIn);
  response.locals.loggedInUser = request.session.user || {};
  next();
};

export const protectorMiddleware = (request, response, next) => {
  if (request.session.loggedIn) {
    return next();
  }
  return response.redirect('/login');
};

export const publicOnlyMiddleware = (request, response, next) => {
  if (!request.session.loggedIn) {
    return next();
  }
  return response.redirect('/');
};

export const avatarUploadMiddleware = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 3000000 },
});

export const videoUploadMiddleware = multer({
  dest: 'uploads/videos/',
  limits: { fileSize: 150000000 },
});
