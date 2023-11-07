export const trending = (request, response) => {
  const videos = [
    {
      title: 'FistVideo',
      rating: 5,
      comments: 3,
      createdAt: '5 minutes ago',
      views: 34,
      id: 1,
    },
    {
      title: 'FistVideo',
      rating: 5,
      comments: 3,
      createdAt: '5 minutes ago',
      views: 34,
      id: 2,
    },
    {
      title: 'FistVideo',
      rating: 5,
      comments: 3,
      createdAt: '5 minutes ago',
      views: 34,
      id: 3,
    },
    {
      title: 'FistVideo',
      rating: 5,
      comments: 3,
      createdAt: '5 minutes ago',
      views: 34,
      id: 4,
    },
  ];
  return response.render('home', { pageTitle: 'Home', videos });
};
export const see = (request, response) => response.render('watch');
export const edit = (request, response) => response.render('edit');
export const search = (request, response) => response.send('Search');
export const upload = (request, response) => response.send('Upload');
export const remove = (request, response) => response.send('Delete');
