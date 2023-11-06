export const trending = (request, response) =>
  response.render('home', { pageTitle: 'Home' });
export const see = (request, response) => response.render('watch');
export const edit = (request, response) => response.render('edit');
export const search = (request, response) => response.send('Search');
export const upload = (request, response) => response.send('Upload');
export const remove = (request, response) => response.send('Delete');
