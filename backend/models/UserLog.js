var mongoose = require('mongoose');
var UserLog = new mongoose.Schema({
    userId                : { type: String, index: true },
    type                  : { type: String, index: true, default: null },
    value                 : { type: String, index: true, default: null },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('user_logs', UserLog);