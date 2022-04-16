const express = require('express');

const ItemsService = require('../services/items.service');
const validatorHandler = require('./../middlewares/validator.handler');
const { getItemSchema} = require('./../schemas/item.schema');

const router = express.Router();
const service = new ItemsService();


router.get('/', async (req, res) => {
  const { q } = req.query;
  const items = await service.get(q);
  res.status(200).json(items);
});



router.get('/:id',
  validatorHandler(getItemSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await service.findOneByID(id);
      res.json(item);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
