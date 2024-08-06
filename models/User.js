import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  subscriptions: [
    {
      giveawayId: { type: Number, required: true }, // Изменено на Number
      channelId: { type: Number, required: true },
      subscribed: { type: Boolean, default: false }
    }
  ]
});

export const User = mongoose.model('User', userSchema);
