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
