import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

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
  try {
    await userModel.create({ name, username, email, password, location });
    return response.redirect('/login');
  } catch (error) {
    console.error(error);
    return response.status(400).render('join', {
      pageTitle,
      errorMessage: 'This username or email is already taken.',
    });
  }
};

export const getLogin = (request, response) => {
  response.render('login', { pageTitle: 'Login' });
};
export const postLogin = async (request, response) => {
  const { username, password } = request.body;
  const user = await userModel.findOne({ username });
  const pageTitle = 'Login';

  if (!user) {
    return response.status(400).render('login', {
      pageTitle,
      errorMessage: 'Account with this username does not exist',
    });
  }

  const userCheck = await bcrypt.compare(password, user.password);

  if (!userCheck) {
    return response.status(400).render('login', {
      pageTitle,
      errorMessage: 'Wrong password',
    });
  }

  request.session.loggedIn = true;
  request.session.user = user;

  return response.redirect('/');
};

export const edit = (request, response) => response.send('edit user');
export const remove = (request, response) => response.send('Remove user');

export const logout = (request, response) => response.send('logout user');
export const see = (request, response) => response.send('see user');

export const startGithubLogin = (request, response) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    allow_signup: false,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  const redirectUrl = `${baseUrl}?${params}`;
  return response.redirect(redirectUrl);
};

export const finishGithubLogin = async (request, response) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GITHUB_CLIENT,
    client_secret: process.env.GITHUB_SECRET,
    code: request.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const requestUrl = `${baseUrl}?${params}`;
  const tokenData = await (
    await fetch(requestUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  const { access_token } = tokenData;
  if (access_token) {
    const userData = await (
      await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    return response.send(JSON.stringify(userData));
  } else {
    return response.redirect('/login');
  }
};
