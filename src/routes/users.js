const { Router } = require('express');
const bcrypt = require('bcrypt');
const ash = require('express-async-handler');

const { User } = require('../models');
const { BadRequestError } = require('../utils/errors');
const { user: userSchemas } = require('../utils/schemas');
const { notAllowedHandler } = require('../middleware/errorHandlers');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = Router();

router.route('/')
  .post([
    auth(),
    validate('body', userSchemas.creationSchema)
  ],
    ash(async (req, res) => {
      const {
        name,
        login,
        password,
        role
      } = req.body;

      const candidate = await User.findOne({ login });
      if (candidate) {
        throw new BadRequestError('User already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        login: login,
        password: hashedPassword,
        role: role
      });

      await user.save();

      return res
        .status(201)
        .json({ status: 201, type: 'Created' });
    }))
  .all(notAllowedHandler);

module.exports = router;
