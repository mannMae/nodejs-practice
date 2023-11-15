import './db';
import { videoMoel } from './models/Video';
import { userMoel } from './models/User';
import { app } from './server';

const handleListening = () => {
  console.log('Server is Running');
};

app.listen(4000, handleListening);
