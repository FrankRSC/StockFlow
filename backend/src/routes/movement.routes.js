const { Router } = require('express');
const router = Router();

const {
  getMovements,
  createMovement
} = require('../controllers/movement.controller');

router.route('/')
  .get(getMovements)
  .post(createMovement);

module.exports = router;
