// api/giveaways.js

import express from 'express';
import Giveaway from '../models/Giveaway.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const giveaways = await Giveaway.find();
    res.json(giveaways);
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    res.status(500).json({ error: 'Ошибка загрузки розыгрышей' });
  }
});

router.post('/', async (req, res) => {
  try {
    const giveaway = new Giveaway(req.body);
    await giveaway.save();
    res.json(giveaway);
  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
    res.status(500).json({ error: 'Ошибка сохранения данных' });
  }
});

export default router;
