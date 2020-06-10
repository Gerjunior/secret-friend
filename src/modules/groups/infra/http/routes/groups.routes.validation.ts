import { celebrate, Joi, Segments } from 'celebrate';

const validateGet = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid ID.').required(),
  }),
});

const validatePost = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().max(255),
    min_value: Joi.number(),
    max_value: Joi.number(),
    draw_date: Joi.date(),
    reveal_date: Joi.date(),
  }),
});

const validatePut = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().max(255),
    min_value: Joi.number(),
    max_value: Joi.number(),
    draw_date: Joi.date(),
    reveal_date: Joi.date(),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid ID').required(),
  }),
});

const validateDelete = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid ID.').required(),
  }),
});

const validateDraw = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid ID.').required(),
  }),
});

export { validateGet, validatePost, validatePut, validateDelete, validateDraw };
