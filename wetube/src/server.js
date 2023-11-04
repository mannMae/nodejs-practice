import express from 'express';

const app = express();

const handleHome = (request, response) => {
  console.log('HOME');
  return response.send('Hello world');
};

const handleLogin = (request, response) => {
  console.log('Login');
  return response.send('Hello Login');
};

app.get('/', handleHome);
app.get('/login', handleLogin);

const handleListening = () => {
  console.log('Server is Running');
};

app.listen(4000, handleListening);
