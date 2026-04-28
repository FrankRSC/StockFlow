const helloCtrl = {};

helloCtrl.helloword = async (req, res) => {
  res.send('hello world');
}

module.exports = helloCtrl;