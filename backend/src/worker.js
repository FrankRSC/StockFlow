const Movement = require('./models/Movement');
const Stock = require('./models/Stock');

let isProcessing = false;

const processMovements = async () => {
  if (isProcessing) return;
  isProcessing = true;

  try {
    const pendingMovements = await Movement.find({ status: 'pending' }).sort({ createdAt: 1 });

    for (const mov of pendingMovements) {
      // Simular lentitud del ERP (5 segundos por movimiento)
      await new Promise(resolve => setTimeout(resolve, 5000));

      try {
        if (mov.type === 'in') {
          await Stock.findOneAndUpdate(
            { product: mov.product, branch: mov.destinationBranch },
            { $inc: { quantity: mov.quantity } },
            { upsert: true, new: true }
          );
          mov.status = 'processed';
        } else if (mov.type === 'out') {
          const updatedStock = await Stock.findOneAndUpdate(
            { product: mov.product, branch: mov.originBranch, quantity: { $gte: mov.quantity } },
            { $inc: { quantity: -mov.quantity } },
            { new: true }
          );

          if (!updatedStock) {
            mov.status = 'failed';
            mov.failureReason = 'Insufficient stock in origin branch';
          } else {
            mov.status = 'processed';
          }
        } else if (mov.type === 'transfer') {
          const updatedOriginStock = await Stock.findOneAndUpdate(
            { product: mov.product, branch: mov.originBranch, quantity: { $gte: mov.quantity } },
            { $inc: { quantity: -mov.quantity } },
            { new: true }
          );

          if (!updatedOriginStock) {
            mov.status = 'failed';
            mov.failureReason = 'Insufficient stock in origin branch';
          } else {
            await Stock.findOneAndUpdate(
              { product: mov.product, branch: mov.destinationBranch },
              { $inc: { quantity: mov.quantity } },
              { upsert: true, new: true }
            );
            mov.status = 'processed';
          }
        } else if (mov.type === 'adjustment') {
          // Procesar ajuste si es necesario (en nuestro caso, el stock se ajusta directamente en stock.controller)
          // Pero para mantener consistencia, si quedó en pending, lo marcamos como processed.
          mov.status = 'processed';
        }

        await mov.save();
        console.log(`Movement ${mov._id} processed with status: ${mov.status}`);
      } catch (err) {
        mov.status = 'failed';
        mov.failureReason = err.message;
        await mov.save();
        console.error(`Movement ${mov._id} failed:`, err);
      }
    }
  } catch (error) {
    console.error('Worker error:', error);
  } finally {
    isProcessing = false;
  }
};

const startWorker = () => {
  setInterval(processMovements, 5000);
  console.log('Movement background worker initialized.');
};

module.exports = startWorker;
