// models/Giveaway.js
import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  id: Number,
  name: String,
  link: String,
  avatar: String,
  subscribed: Boolean,
});

const giveawaySchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  image: String,
  endDate: Date,
  isActive: Boolean,
  channels: [channelSchema],
});

const Giveaway = mongoose.model('Giveaway', giveawaySchema);

export default Giveaway;
