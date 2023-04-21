var mongoose = require('mongoose');
var pinsystemSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    createdBy             : { type: String, index: true },
    transactionId         : { type: String, index: true,},
    pintype               : { type: Number, index: true, default: 0 ,ref: "0:normal,1:primium,2:dummy,3:power"},
    gdxamount             : { type: Number, index: true, default: 0 },
    usdamount             : { type: Number, index: true, default: 0 },
    tokenType             : { type: String, index: true },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('pinsystem', pinsystemSchema);