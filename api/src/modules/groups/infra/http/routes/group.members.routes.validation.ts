import { celebrate, Joi, Segments } from 'celebrate';

const validateAdd = celebrate({
  [Segments.BODY]: Joi.object().keys({
    group_id: Joi.string().guid().message('Invalid group ID').required(),
    user_id: Joi.string().guid().message('Invalid user ID').required(),
  }),
});

const validateRemove = celebrate({
  [Segments.BODY]: Joi.object().keys({
    group_id: Joi.string().guid().message('Invalid group ID').required(),
    user_id: Joi.string().guid().message('Invalid user ID').required(),
  }),
});

export { validateAdd, validateRemove };
