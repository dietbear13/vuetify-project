import express from 'express';
import { User } from '../models/User.js';
import { Giveaway } from '../models/Giveaway.js';

const router = express.Router();

router.post('/check-subscription', async (req, res) => {
  const { userId, channelId, giveawayId } = req.body;
  
  try {
    const user = await User.findOne({ telegramId: userId });
    const subscription = user.subscriptions.find(sub => sub.channelId === channelId && sub.giveawayId.toString() === giveawayId);

    if (!subscription) {
      return res.status(404).json({ error: 'Подписка не найдена' });
    }

    // Здесь будет логика проверки подписки через Telegram API
    const isMember = true; // Замените на фактическую проверку

    subscription.subscribed = isMember;
    await user.save();

    res.json({ isMember });
  } catch (error) {
    console.error('Ошибка проверки подписки', error);
    res.status(500).json({ error: 'Ошибка проверки подписки' });
  }
});

export default router;
