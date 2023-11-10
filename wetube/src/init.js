import './db';
import { videoMoel } from './models/Video';
import { app } from './server';

const handleListening = () => {
  console.log('Server is Running');
};

app.listen(4000, handleListening);
