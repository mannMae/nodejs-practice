import express from 'express';
import morgan from 'morgan';

const app = express();

const logger = morgan('dev');

app.use(logger);

const home = (request, response) => response.send('Hello world');

app.get(
  '/',
  // middleware,
  home
);

const handleListening = () => {
  console.log('Server is Running');
};

app.listen(4000, handleListening);
