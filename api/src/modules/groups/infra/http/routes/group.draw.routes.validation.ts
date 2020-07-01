import { celebrate, Joi, Segments } from 'celebrate';

const validateDraw = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().guid().message('Invalid group ID.').required(),
  }),
});

export { validateDraw };
