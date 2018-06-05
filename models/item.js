const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    default: null
  },
  originalPrice: {
    type: Number,
    default: null
  },
  year: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: null,
    trim: true
  },
  size: {
    type: String,
    default: null,
    trim: true
  },
  currentCondition: {
    type: String,
    default: null,
    trim: true
  },
  brand: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  image2: {
    type: String,
    trim: true
  },
  sold: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
});

module.exports = Item = mongoose.model('Item', schema);