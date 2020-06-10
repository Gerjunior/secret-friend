import { celebrate, Joi, Segments } from 'celebrate';

const validateGet = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    user_id: Joi.string().guid().message('Invalid ID.').required(),
  }),
});

const validatePost = celebrate({
  [Segments.BODY]: Joi.object().keys({
    first_name: Joi.string().required().max(255),
    email: Joi.string().email().required().max(255),
    password: Joi.string().required().max(255),
    last_name: Joi.string().max(255),
    birth_date: Joi.date(),
    nickname: Joi.string().max(255),
    description: Joi.string().max(500),
  }),
});

const validatePut = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid ID').required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    first_name: Joi.string().max(255),
    last_name: Joi.string().max(255),
    email: Joi.string().email().max(255),
    old_password: Joi.string().required().max(255),
    password: Joi.string().max(255),
    password_confirmation: Joi.string().valid(Joi.ref('password')).max(255),
    birth_date: Joi.date(),
    nickname: Joi.string().max(255),
    description: Joi.string(),
  }),
});

export { validateGet, validatePost, validatePut };
