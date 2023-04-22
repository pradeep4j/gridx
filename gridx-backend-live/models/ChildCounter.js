var mongoose = require('mongoose');
var childcounterSchema = new mongoose.Schema({
    uid                     : { type: String, index: true },
    uleftcount              : { type: Number, index: true, default: 0 },
    urightcount             : { type: Number, index: true, default: 0 },
    total_leftcount         : { type: Number, index: true, default: 0 },
    total_rightcount        : { type: Number, index: true, default: 0 },
    left_pv                 : { type: Number, index: true, default: 0 },
    right_pv                : { type: Number, index: true, default: 0 },
    total_left_pv           : { type: Number, index: true, default: 0 },
    total_right_pv          : { type: Number, index: true, default: 0 },
    created_at              : { type: Date, default: Date.now, index: true},
    updated_at              : { type: Date, default: Date.now },  
    // directWallet            : { type: Number, index: true, default: 0 },
});




module.exports = mongoose.model('childcounter', childcounterSchema);