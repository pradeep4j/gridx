const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./../config/config');
const Users = require('../models/Users');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null || token ==undefined)
    {
        config.response(403, 'Token Not Found !', {}, res);
    } 
    else
    {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
            if (err) config.response(403, 'Invalid Token!', {}, res);
            const userid=await Users.findOne({tokens: [token]});
            if(userid)
            {
                req._id =userid._id
                req.user = user._id
                req.token = token
    
                next()
            }
            else
            {
                config.response(403,'Invalid Token!',{},res);
            }
        })
    }
    
}

module.exports = authenticateToken;