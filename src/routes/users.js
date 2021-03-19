const { Router } = require('express');
const bcrypt = require('bcrypt');
const ash = require('express-async-handler');

const { User } = require('../models');
const { getSchemaFields } = require('../utils/helpers');
const { notAllowedHandler } = require('../middleware/errorHandlers');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const auth = require('../middleware/auth');
const schemas = require('../utils/schemas');
const dbQuery = require('../middleware/dbQuery');
const validate = require('../middleware/validation');


const router = Router();
const defaultProjection = 'name login role';
const allowedFields = getSchemaFields(User.schema, ['__v', 'password']);

// route:api/users/
router.route('/')
  // GET
  .get([
    auth(),
    validate('query', schemas.db.query),
    dbQuery({ allowedFields })
  ],
    ash(async (req, res) => {
      const dbQuery = req.dbQuery;

      const users = await User.find(
        dbQuery.filter,
        dbQuery.projection || defaultProjection,
        dbQuery.options
      ).lean();

      return res.json({ status: 200, type: 'OK', data: users });
    })
  )
  // POST
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

      const candidate = await User.findOne({ login }).lean();
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

// route:api/users/:id
router.route('/:id')
  // GET
  .get([
    auth(),
    validate('params', schemas.db.objectId),
    dbQuery({
      parseFilter: false,
      parseOptions: false,
      allowedFields
    })
  ],
    ash(async (req, res) => {
      const { id } = req.params;
      const { projection } = req.dbQuery;

      const user = await User.findById(id, projection || defaultProjection).lean();
      if (!user) {
        throw new NotFoundError();
      }

      return res.json({ status: 200, type: 'OK', data: user });
    })
  )
  // PATCH
  .patch([
    auth(),
    validate('params', schemas.db.objectId),
    validate('body', schemas.user.updateSchema)
  ],
    ash(async (req, res) => {
      const { id } = req.params;
      const {
        name,
        password,
        role
      } = req.body;

      const user = await User.findById(id);
      if (!user) {
        throw new NotFoundError();
      }

      if (name) {
        user.name = name;
      }

      if (role) {
        user.role = role;
      }

      if (password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
      }

      await user.save();

      return res.json({ status: 200, type: 'OK' });
    })
  )
  // DELETE
  .delete([
    auth(),
    validate('params', schemas.db.objectId)
  ],
    ash(async (req, res) => {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user) {
        throw new BadRequestError('User does not exist');
      }

      user.remove();

      return res.json({ status: 200, type: 'OK' });
    })
  )
  .all(notAllowedHandler)

module.exports = router;
