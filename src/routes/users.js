const { Router } = require('express');
const bcrypt = require('bcrypt');
const ash = require('express-async-handler');

const { User } = require('../models');
const { BadRequestError } = require('../utils/errors');
const { getSchemaFields } = require('../utils/helpers');
const { notAllowedHandler } = require('../middleware/errorHandlers');
const auth = require('../middleware/auth');
const schemas = require('../utils/schemas');
const dbQuery = require('../middleware/dbQuery');
const validate = require('../middleware/validation');

const router = Router();

router.route('/')
  .get([
    auth(),
    validate('query', schemas.querySchema),
    dbQuery({
      allowedFields: getSchemaFields(User.schema, ['__v', 'password'])
    })
  ],
    ash(async (req, res) => {
      const dbQuery = req.dbQuery;
      const users = await User.find(
        dbQuery.query,
        dbQuery.projection || 'name login role',
        dbQuery.options
      );

      return res.json({ status: 200, type: 'OK', data: users });
    })
  )
  .post([
    auth(),
    validate('body', schemas.user.creationSchema)
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
    })
  )
  .all(notAllowedHandler);

module.exports = router;
