const express = require('express');
const router = express.Router();
const url = require('url');

const Category = require('./models/category');
const Item = require('./models/item');

/* Router params */

router.param('category', async (req, res, next, categorySlug) => {
  req.category = await Category.findOne({ slug: categorySlug });

  if (!req.category) {
    const err = new Error('Catégorie introuvable');
    err.status = 404;
    next(err);
    return;
  }

  req.items = await Item.find({ deleted: false, category: categorySlug }).sort({ sold: 1 });

  next();
});

router.param('id', (req, res, next, id) => {
  Item.findOne({ _id: id }).exec((error, item) => {
    if (error || !item) {
      const err = new Error('Item introuvable');
      err.status = 404;
      next(err);
      return;
    }

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

router.get('/categorie/:category', (req, res, next) => {
  res.render('category', {
    title: 'Catégorie',
    category: req.category,
    items: req.items,
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
