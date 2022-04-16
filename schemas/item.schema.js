const Joi = require('joi');

const id = Joi.string();

const getItemSchema = Joi.object({
  id: id.required(),
});

module.exports = { getItemSchema }
