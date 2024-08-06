import express from 'express';
import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import cors from 'cors';
import Giveaway from './models/Giveaway.js';
import winston from 'winston';
import path from 'path';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*', // Разрешает все источники. Для более безопасного варианта укажите точные источники.
  methods: ['GET', 'POST'], // Разрешает только эти методы
  allowedHeaders: ['Content-Type', 'Authorization'] // Разрешает только эти заголовки
}));

const bot = new Telegraf('7451733807:AAH8I1giaTwOoENmhDfQggODXRvWdf-s5hw');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

mongoose.connect('mongodb://localhost:27017/data')
  .then(() => {
    logger.info('Connected to MongoDB');
    console.log('Connected to MongoDB');
    // Загрузка начальных данных только при первом запуске
    // loadInitialData();
  })
  .catch(err => {
    logger.error('Error connecting to MongoDB', err);
    console.error('Error connecting to MongoDB', err);
  });

mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to db');
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  logger.error(err.message);
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose connection is disconnected');
  console.log('Mongoose connection is disconnected');
});

// API для получения розыгрышей
app.get('/api/giveaways', async (req, res) => {
  try {
    const giveaways = await Giveaway.find();
    res.json(giveaways);
  } catch (error) {
    logger.error('Ошибка получения данных', error);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
});

// API для проверки подписки
app.post('/api/check-subscription', async (req, res) => {
  const { userId, channelId } = req.body;
  try {
    const member = await bot.telegram.getChatMember(channelId, userId);
    const isMember = member.status === 'member' || member.status === 'administrator' || member.status === 'creator';
    res.json({ isMember });
  } catch (error) {
    logger.error('Ошибка проверки подписки', error);
    res.status(500).json({ error: 'Ошибка проверки подписки' });
  }
});

// Настройка для обслуживания статических файлов из папки 'dist'
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));

// Обработка маршрутов для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  logger.info(`Server is listening on http://localhost:${port}`);
  console.log(`Server is listening on http://localhost:${port}`);
});
