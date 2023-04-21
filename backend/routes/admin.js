var express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, body, validationResult } = require('express-validator');
const config = require('../config/config');
const Users = require('../models/Users');
var admincon = require("../controllers/AdminController");
dotenv.config();
var router = express.Router();
router.post('/login', async (req, res) => {
        try {
            const user = await Users.findOne({ username: req.body.username });
            if (!user) {
                //next(createError(404,"User Not Found!"));
                return res.send("404");
            }
            const passwordDB = user.password;
            const matchPasswotd = await bcrypt.compare(req.body.password, passwordDB);
        
            if (matchPasswotd === false) {
                return res.send("400");
            }
        
            //since in output of return response.json({...otherDetails}); I am getting collectable values in _doc variable so
            const { password, ...otherDetails } = user._doc;
            //now I have to install a jwt here. first install npm install jsonwebtoken and create jwt via openssl>rand -base64 32 and put it to .env file for privacy. And now create token with sign jwt token with user id and isadmin as
            const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "2d" });
            //now put this token in a cookie by installing npm install cookie-parser. After this initialize this cookie-parser in index.js as app.use() and send back a cookie in response to browser with created token
            //res.cookie('access_token',token,{expire : 36000 + Date.now(), httpOnly:true}).status(200).json({...otherDetails});
            otherDetails.access_token = token;
            res.cookie('access_token', token, { maxAge: (2 * 24 * 60 * 60 * 1000) /* cookie will expires in 2 days*/, httpOnly: true }).status(201).json({ ...otherDetails });
        
        } catch (error) {
            res.status(400).json({ message: error.message });
           // next(error);
        }
    
});
router.get('/logout', async (request, response) => {
    try {
        response.clearCookie('access_token');
        response.status(201).json('User Logged out successfully!!');

    } catch (error) {
        response.status(404).json({ message: error.message })
    }
});
router.post('/', (req, res) => {
    config.response(200, 'dashboard', {}, res);

});
router.post('/pinsystem',
    check('gdxamount', 'amount must be a number between 50 and 1000').isInt({ min: 50, max: 1000 }),
    body('gdxamount').not().isEmpty().withMessage("The amount field is required!"),
    body('username').not().isEmpty().withMessage("The username Field is required!"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            admincon.PinSystem(req, res);
        }

    });

router.post('/walletrequest', (req, res, next) => {
    admincon.walletRequest(req, res, next);
});

router.post('/approveRejectWalletRequest', 
body('type').not().isEmpty().withMessage("The type field is required!"),
body('requestId').not().isEmpty().withMessage("The requestId field is required!"),
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400, 'Validation Error!', { errors: errors.array() }, res);
    }
    else {
        admincon.approveRejectWalletRequest(req, res, next);
    }
});
/*router.post('/login', 
//body('email').not().isEmpty().withMessage("The email field is required!"),
//body('password').not().isEmpty().withMessage("The requestId field is required!"),
(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        config.response(400, 'Validation Error!', { errors: errors.array() }, res);
    }
    else {
        admincon.approveRejectWalletRequest(req, res, next);
    }
});*/

module.exports = router; 