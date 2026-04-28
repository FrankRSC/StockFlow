const querys = require('../helpers/querys');

const branchCtrl = {};

branchCtrl.getBranches = async (req, res) => {
  try {
    const branches = await querys.getAllBranches();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

branchCtrl.getBranch = async (req, res) => {
  try {
    const branch = await querys.getBranchById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

branchCtrl.createBranch = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newBranch = await querys.createBranch({ name, location });
    res.status(201).json(newBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

branchCtrl.updateBranch = async (req, res) => {
  try {
    const { name, location } = req.body;
    const updatedBranch = await querys.updateBranch(
      req.params.id,
      { name, location }
    );
    if (!updatedBranch) return res.status(404).json({ message: 'Branch not found' });
    res.json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

branchCtrl.deleteBranch = async (req, res) => {
  try {
    const deletedBranch = await querys.deleteBranch(req.params.id);
    if (!deletedBranch) return res.status(404).json({ message: 'Branch not found' });
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = branchCtrl;
