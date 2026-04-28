const { Router } = require('express');
const router = Router();

const {
  helloword
} = require('../controllers/hello.controller');

router.route('/')
  .get(helloword)

module.exports = router;