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
  const user = await userModel.findOne({ username, socialOnly: false });
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

export const remove = (request, response) => response.send('Remove user');

export const logout = (request, response) => {
  request.session.destroy();
  return response.redirect('/');
};
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
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailObject = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObject) {
      return response.redirect('/');
    }

    let user = await userModel.findOne({ email: emailObject.email });

    if (!user) {
      user = await userModel.create({
        avatartUrl: userData.avatart_url,
        name: userData.name,
        username: userData.login,
        email: emailObject.email,
        password: '',
        socialOnly: true,
        location: userData.location,
      });
    }

    request.session.loggedIn = true;
    request.session.user = user;
    return response.redirect('/');
    // return response.send(JSON.stringify(userData));
  } else {
    return response.redirect('/login');
  }
};

export const getEdit = (request, response) => {
  return response.render('edit-profile', { pageTitle: 'Edit Profile' });
};

export const postEdit = async (request, response) => {
  const {
    session: {
      user: { _id },
    },
    body: { name, email, username, location },
  } = request;
  await userModel.findByIdAndUpdate(
    _id,
    { name, email, username, location },
    { new: true }
  );
  request.session.user = {
    ...request.session.user,
    name,
    email,
    username,
    location,
  };
  return response.redirect('/users/edit');
};

export const getChangePassword = (request, response) => {
  if (request.session.user.socialOnly) {
    return response.redirect('/');
  }
  return response.render('users/change-password', {
    pageTitle: 'Change Password',
  });
};

export const postChangePassword = async (request, response) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = request;

  const checkOldPassword = await bcrypt.compare(oldPassword, password);
  if (!checkOldPassword) {
    return response.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The current password is incorrect',
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return response.status(400).render('users/change-password', {
      pageTitle: 'Change Password',
      errorMessage: 'The password does not match the confirmation',
    });
  }

  const user = await userModel.findById(_id);
  user.password = newPasswword;
  await user.save();
  return response.redirect('/');
};
