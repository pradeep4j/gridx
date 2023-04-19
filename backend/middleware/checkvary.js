const jwt =require('jsonwebtoken');
const dotenv =require('dotenv');
dotenv.config();
const config = require("../config/config");
const Users = require("../models/Users");
const Authenticateevel=(req,res,next)=>{
const authHeader = req.headers['authorization']
const token = authHeader && authHeader.split(' ')[1]
if (token == null) config.response(403,'Token Not Found!',{},res);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, api_key) => {
        if (err){
            config.response(403,'Invalid Token!',{},res);
        } 
        else 
        {
            const username = api_key._id;
            Users.findOne({"username":username})
            .then(users => {
                if(users.ev)
                {
                    next()
                }
                else
                {
                    res.status(403).json({ data: {}, message: "Please Veriyfy Your Mobile No.", status: false });
                }
            })
            .catch(error => { 
               config.response(500,'Internal server error',{},res);
            })
            
        }
    });
}
module.exports = Authenticateevel;