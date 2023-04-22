var mongoose = require('mongoose');
var directreportSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    amount                : { type: Number, index: true ,default: 0},
    business              : { type: Number, index: true ,default: 0},
    createdBy             : { type: String, index: true},
    status                : { type: Number, index: true, default: 0},
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('directreport', directreportSchema);