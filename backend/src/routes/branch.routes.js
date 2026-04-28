const { Router } = require('express');
const router = Router();

const {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
  deleteBranch
} = require('../controllers/branch.controller');

router.route('/')
  .get(getBranches)
  .post(createBranch);

router.route('/:id')
  .get(getBranch)
  .put(updateBranch)
  .delete(deleteBranch);

module.exports = router;
