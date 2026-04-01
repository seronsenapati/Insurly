const { validationResult } = require('express-validator');

/**
 * Validation middleware — collects express-validator errors and returns them
 * Used after express-validator check chains in routes
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(', '),
      errors: errors.array()
    });
  }

  next();
};

module.exports = validate;
