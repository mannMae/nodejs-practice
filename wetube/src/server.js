import express from 'express';

const app = express();

const logger = (request, response, next) => {
  console.log(`${request.method} ${request.url}`);
  next();
};

app.use(logger);

const handleHome = (request, response) => {
  console.log('HOME');
  return response.send('Hello world');
};

app.get(
  '/',
  // middleware,
  handleHome
);

const handleListening = () => {
  console.log('Server is Running');
};

app.listen(4000, handleListening);
