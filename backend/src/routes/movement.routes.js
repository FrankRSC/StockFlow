const { Router } = require('express');
const router = Router();

const {
  getMovements,
  createMovement,
  getMovementReport
} = require('../controllers/movement.controller');

router.route('/')
  .get(getMovements)
  .post(createMovement);

router.get('/report', getMovementReport);

module.exports = router;

