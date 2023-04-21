var mongoose = require('mongoose');
var walletrequestSchema = new mongoose.Schema({
    userId                : { type: String, index: true },
    hash                  : { type: String, index: true,},
    gdxamount             : { type: Number, index: true, default: 0 },
    status                : { type: Number, index: true, default: 0,ref: "0:pending,1:success,2:rejected" },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },  
});
module.exports = mongoose.model('walletrequest', walletrequestSchema);