var mongoose = require('mongoose');
var buytokenSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    createdBy             : { type: String, index: true },
    transactionId         : { type: String, index: true,},
    pintype               : { type: Number, index: true, default: 0 },
    gdxamount             : { type: Number, index: true, default: 0 },
    usdamount             : { type: Number, index: true, default: 0 },
    status                : { type: Number, index: true, default: 0,ref: "0:active,1:retopup" },
    commDate              : { type: Date, default: Date.now, index: true },
    tokenType             : { type: String, index: true },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('buytoken', buytokenSchema);