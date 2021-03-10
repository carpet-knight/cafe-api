const { Router } = require('express');
const bcrypt = require('bcrypt');
const ash = require('express-async-handler');

const { User } = require('../models');
const { BadRequestError } = require('../utils/errors');
const { notAllowedHandler } = require('../middleware/errorHandlers');
const auth = require('../middleware/auth');
const schemas = require('../utils/schemas');
const validate = require('../middleware/validation');


// login specific middleware
const alreadyAuthorizedCheck = (req, res, next) => {
  if (req.session.user) {
    throw new BadRequestError('Already authorized')
  }

  next();
}

const router = Router();

// route:api/login
router.route('/login')
  .post([
    alreadyAuthorizedCheck,
    validate('body', schemas.loginSchema)
  ],
    ash(async (req, res, next) => {
      const { login, password } = req.body;

      const user = await User.findOne({ login });
      if (!user) {
        throw new BadRequestError('Incorrect login data');
      }

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        throw new BadRequestError('Incorrect login data');
      }

      req.session.user = {
        id: user.id,
        role: user.role
      }

      return res.json({ status: 200, type: 'OK' });
    })
  )
  .all(notAllowedHandler);


// route:api/logout
router.route('/logout')
  .post([
    auth(['admin', 'manager', 'employee', 'customer'])
  ],
    (req, res, next) => {
      req.session.destroy(err => {
        if (err) {
          return next(err);
        }

        return res
          .clearCookie('sid', { path: '/api' })
          .json({ status: 200, type: 'OK' });
      });
    })
  .all(notAllowedHandler);

module.exports = router;
