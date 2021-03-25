const { Router } = require('express');
const ash = require('express-async-handler');
const csrf = require('csrf');

const { notAllowedHandler } = require('../middleware/errorHandlers');


const router = Router();
const tokens = new csrf();

// route:api/token
router.route('/')
  // GET
  .get(
    ash(async (req, res) => {
      const secret = await tokens.secret();
      const _csrf = tokens.create(secret);
      req.session._csrf = _csrf;

      return res.json({ status: 200, type: 'OK', _csrf });
    })
  )
  .all(notAllowedHandler);

module.exports = router;
