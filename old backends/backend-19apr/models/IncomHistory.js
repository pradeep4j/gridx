var mongoose = require('mongoose');
var IncomHistorySchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    amount                : { type: Number, index: true ,default: 0},
    type                  : { type: String, index: true},
    category              : { type: String, index: true},
    description           : { type: String, index: true },
    status                : { type: Number, index: true, default: 0},
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('IncomHistory', IncomHistorySchema);