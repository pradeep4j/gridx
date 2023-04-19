var mongoose = require('mongoose');
var dailybusinessSchema = new mongoose.Schema({
    uid                     : { type: String, index: true },
    business                : { type: Number, index: true, default: 0 },
    position                : { type: String, index: true, default: 0 },
    created_at              : { type: Date, default: Date.now, index: true},
    updated_at              : { type: Date, default: Date.now },  
});
module.exports = mongoose.model('dailybusiness', dailybusinessSchema);