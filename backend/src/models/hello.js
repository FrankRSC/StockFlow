const { Schema, model } = require('mongoose');
const ObjectId = Schema.Types.ObjectId
const helloSchema = new Schema({
    hello: { type: String, required: true },
}, {
    timestamps: true
});

//Exporta el schema
module.exports = model('Hello', helloSchema);