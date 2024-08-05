import express from 'express';
import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import cors from 'cors';
import Giveaway from './models/Giveaway.js';
import winston from 'winston';

const app = express();
app.use(express.json());
app.use(cors());

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

mongoose.connect('mongodb://localhost:27017/data', { useNewUrlParser: true, useUnifiedTopology: true })
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is listening on http://localhost:${port}`);
  console.log(`Server is listening on http://localhost:${port}`);
});

// const loadInitialData = async () => {
//   const count = await Giveaway.countDocuments();
//   if (count === 0) {
//     const initialData = [
//       {
//         id: 1,
//         title: 'Розыгрыш 1',
//         description: 'Описание розыгрыша 1',
//         image: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
//         endDate: new Date('2023-12-31'),
//         isActive: true,
//         channels: [
//           {
//             id: 1,
//             name: 'Канал 1',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           },
//           {
//             id: 2,
//             name: 'Канал 2',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           }
//         ]
//       },
//       {
//         id: 2,
//         title: 'Розыгрыш 2',
//         description: 'Описание розыгрыша 2',
//         image: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
//         endDate: new Date('2024-01-15'),
//         isActive: true,
//         channels: [
//           {
//             id: 3,
//             name: 'Канал 3',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           },
//           {
//             id: 4,
//             name: 'Канал 4',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           }
//         ]
//       },
//       {
//         id: 3,
//         title: 'Розыгрыш 3',
//         description: 'Описание розыгрыша 3',
//         image: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
//         endDate: new Date('2024-02-01'),
//         isActive: false,
//         channels: [
//           {
//             id: 5,
//             name: 'Канал 5',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           },
//           {
//             id: 6,
//             name: 'Канал 6',
//             link: 'https://t.me/seo_automatization',
//             avatar: 'https://via.placeholder.com/48',
//             subscribed: false
//           }
//         ]
//       }
//     ];

//     await Giveaway.insertMany(initialData);
//     logger.info('Initial data loaded');
//     console.log('Initial data loaded');
//   }
// };
