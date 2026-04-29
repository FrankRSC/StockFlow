const app = require('./app');
const startWorker = require('./worker');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  startWorker();
});
