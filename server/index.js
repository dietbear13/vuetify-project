// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import giveaways from '..//..//vuetify-project//api//giveaways';

const app = express();

mongoose.connect('mongodb://localhost:27017/data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/giveaways', giveaways);

export default {
  path: '/',
  handler: app,
};
