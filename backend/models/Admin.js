var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var adminSchema = new mongoose.Schema({
    name                    : { type: String, index: true, required: true },
    username                : { type: String, index: true, unique: true, required: true },
    usertype                : { type: String, enum: ['employee', 'admin'], default: 'admin',index: true,  required: true, },
    email                   : { type: String, index: true},
    mobile                  : { type: Number, index: true },
    password                : { type: String, index: true, required: true },
    status                  : { type: Number, index: true, default: 1 },
    tokens                  : { type: Array, index: true },
    role                    :{type:String,index:true},
    created_at              : { type: Date, default: Date.now, index: true},
    updated_at              : { type: Date, default: Date.now },  
});

module.exports = mongoose.model('admin', adminSchema);