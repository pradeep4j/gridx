var mongoose = require('mongoose');
var p2ptranSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    createdBy             : { type: String, index: true },
    transactionId         : { type: String, index: true,},
    gdxamount             : { type: Number, index: true, default: 0 },
    usdamount             : { type: Number, index: true, default: 0 },
    status                : { type: Number, index: true, default: 0,ref: "0:active,1:retopup" },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('p2ptran', p2ptranSchema);