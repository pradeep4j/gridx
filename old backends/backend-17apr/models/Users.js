var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    name                    : { type: String, index: true, required: true },
    username                : { type: String, index: true, unique: true, required: true },
    email                   : { type: String, index: true, unique: true, required: true },
    mobile                  : { type: Number, index: true, unique: true, required: true },
    address                 : { type: String, index: true },
    parentId                : { type: String, index: true, default: 0 },
    sponsor                 : { type: String, index: true, default: 0 },
    wallet                  : { type: Number, index: true, default: 0 },
    externalWallet          : { type: Number, index: true, default: 0 },
    externalGDXWallet       : { type: Number, index: true, default: 0 },
    internalGDXWallet       : { type: Number, index: true, default: 0 },
    internalWallet          : { type: Number, index: true, default: 0 },
    directWallet            : { type: Number, index: true, default: 0 },
    binaryWallet            : { type: Number, index: true, default: 0 },
    roiWallet               : { type: Number, index: true, default: 0 },
    shibaWallet             : { type: Number, index: true, default: 0 },
    babyDogeWallet          : { type: Number, index: true, default: 0 },
    gridxWallet             : { type: Number, index: true, default: 0 },
    withdrawalAmount        : { type: Number, index: true, default: 0 },
    position                : { type: String, index: true, required: true },
    password                : { type: String, index: true, required: true },
    tokens                  : { type: Array, index: true },
    otp                     : { type: String, index: true, default: null},
    ev                      : { type: Number, index: true, default: 0 },
    sv                      : { type: Number, index: true, default: 0 },
    status                  : { type: Number, index: true, default: 1 },
    renewalStatus           : { type: Number, index: true, default: 0 },
    activ_member            : { type: Number, index: true, default: 0 },
    otp_time                : { type: Date, index: true},
    email_verified_at       : { type: Date, index: true},
    created_at              : { type: Date, default: Date.now, index: true},
    updated_at              : { type: Date, default: Date.now },  
});


// Generating JWT autentication token
userSchema.methods.authToken = async function (logout=false) {
    try {
        if(logout){
            // console.log(token);
            this.tokens = '';
            // this.tokens = this.tokens.concat({token: token});
            await this.save();
    
            return token;
        }else{
            const token = jwt.sign({_id: this.username.toString()}, process.env.TOKEN_SECRET);
            // console.log(token);
            this.tokens = token;
            // this.tokens = this.tokens.concat({token: token});
            await this.save();
    
            return token;
        }
    } catch (error) {
        console.log(`Token error`+error);
    }
}


module.exports = mongoose.model('users', userSchema);