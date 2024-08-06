import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Giveaway } from './models/Giveaway.js';
import connectDB from './config/db.js';

connectDB();

const fetchUsersWithSubscriptions = async () => {
  try {
    const users = await User.find().populate('subscriptions.giveawayId');
    console.log('Пользователи с подписками:', users);
  } catch (error) {
    console.error('Ошибка при получении данных пользователей:', error);
  } finally {
    mongoose.connection.close();
  }
};

fetchUsersWithSubscriptions();
