const express = require('express');
const router = express.Router();
const url = require('url');

const Category = require('./models/category');
const Item = require('./models/item');

/* Router params */

router.param('category', (req, res, next, categorySlug) => {
  Category.findOne({ slug: categorySlug }).exec((error, category) => {
    req.category = category;
    next();
  });
});

router.param('id', (req, res, next, id) => {
  Item.findOne({ _id: id }).exec((error, item) => {
    req.item = item;
    next();
  });
});

/* Middlewares */

router.use(async (req, res, next) => {
  req.items = await Item.find({ deleted: false }).sort({ sold: 1 });
  req.categories = await Category.find();

  next();
});

/* Routes */

router.get('/items/:id', (req, res, next) => {
  if (req.item.website) {
    const parsedUrl = url.parse(req.item.website);
    req.item.urlDescription = parsedUrl.hostname.replace(/^www./, '');
  }

  res.render('item', {
    title: req.item.title,
    item: req.item,
    category: req.categories.find(category => (category.slug === req.item.category)),
  });
});

router.get('/items', (req, res, next) => {
  res.render('items', {
    title: 'Items',
    categories: req.categories.map((category) => {
      category.items = req.items.filter(item => (item.category === category.slug));
      return category;
    }),
  });
});

router.get('/', (req, res, next) => {
  res.render('items', {
    title: 'Items',
    categories: req.categories.map((category) => {
      category.items = req.items.filter(item => (item.category === category.slug));
      return category;
    }),
  });
});

module.exports = router;
