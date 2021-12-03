const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    gameImage: { type: String }
});

module.exports = mongoose.model('Game', gameSchema);