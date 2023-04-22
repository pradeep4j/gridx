var mongoose = require('mongoose');
var binaryreportSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    amount                : { type: Number, index: true ,default: 0},
    left_business         : { type: Number, index: true ,default: 0},
    right_business        : { type: Number, index: true ,default: 0},
    matching              : { type: Number, index: true ,default: 0},
    status                : { type: Number, index: true, default: 0},
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('binaryreport', binaryreportSchema);