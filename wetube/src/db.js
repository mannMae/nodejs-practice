// brew services start mongodb-community
// mongod --config /usr/local/etc/mongod.conf
// mongosh
// mongodb://127.0.0.1:27017/

import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/wetube');

const db = mongoose.connection;

const handleOpen = () => console.log('OPEN');
db.once('open', handleOpen);

db.on('error', (error) => console.error(error));
