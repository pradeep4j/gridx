var mongoose = require('mongoose');
var generalSettings = new mongoose.Schema({
    email_template        : { type: String, index: true },
    gdx_rate              : { type: Number, index: true },
    created_at            : { type: Date, default: Date.now, index: true },
    updated_at            : { type: Date, default: Date.now },   
});
module.exports = mongoose.model('generalSettings', generalSettings);



