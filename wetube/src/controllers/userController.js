import { userModel } from '../models/User';

export const getJoin = (request, response) =>
  response.render('join', { pageTitle: 'Join' });
export const postJoin = async (request, response) => {
  const { name, username, email, password, passwordConfirm, location } =
    request.body;
  const pageTitle = 'Join';
  if (password !== passwordConfirm) {
    return response.status(400).render('join', {
      pageTitle,
      errorMessage: 'Password confirmatioon does not match.',
    });
  }

  const userExists = await userModel.exists({ $or: [{ username }, { email }] });
  if (userExists) {
    return response.status(400).render('join', {
      pageTitle,
      errorMessage: 'This username or email is already taken.',
    });
  }
  await userModel.create({ name, username, email, password, location });
  return response.redirect('/login');
};
export const edit = (request, response) => response.send('edit user');
export const remove = (request, response) => response.send('Remove user');

export const login = (request, response) => response.send('login user');
export const logout = (request, response) => response.send('logout user');
export const see = (request, response) => response.send('see user');
