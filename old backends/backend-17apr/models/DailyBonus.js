var mongoose = require('mongoose');
var dailybonusSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    transId               : { type: String, index: true,},
    amount                : { type: Number, index: true, default: 0 },
    status                : { type: Number, index: true, default: 0,ref: "0:pending,1:success,2:rejected" },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },  
});
module.exports = mongoose.model('dailybonus', dailybonusSchema);