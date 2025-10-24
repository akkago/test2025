const Joi = require('joi');

const bookingSchema = Joi.object({
  event_id: Joi.number().integer().positive().required(),
  user_id: Joi.string().min(1).max(255).required()
});

const validateBooking = (req, res, next) => {
  const { error, value } = bookingSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации',
      details: error.details.map(detail => detail.message)
    });
  }
  
  req.validatedData = value;
  next();
};

module.exports = {
  validateBooking
};
