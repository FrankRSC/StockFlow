const { Router } = require('express');
const router = Router();

const { signup, login } = require('../controllers/auth.controller');

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
