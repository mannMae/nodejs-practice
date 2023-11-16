export const localsMiddleware = (request, response, next) => {
  response.locals.loggedIn = Boolean(request.session.loggedIn);
  response.locals.loggedInUser = request.session.user;
  next();
};
