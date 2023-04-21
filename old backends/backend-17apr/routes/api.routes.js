var express = require('express');
const { check,body, validationResult } = require('express-validator');
const config = require('../config/config');
const Users = require('../models/Users');
var base = require("../controllers/BaseController");
var router = express.Router();

router.get('/',  (req, res) =>{
    res.status(200).send('Welcome');
});

router.post('/register',
    check('mobile').not().isEmpty().withMessage("The Mobile field is required!")
    .custom((value,{ req }) => {
        return Users.findOne({mobile: value})
        .then((user) => {  
            if(user){
                return Promise.reject('Mobile has been already used!')
            }
        })
    }),
    check('email').not().isEmpty().withMessage("The Email field is required!")
    .custom((value,{ req }) => {
        return Users.findOne({email: value})
        .then((user) => {  
            if(user){
                return Promise.reject('Email has been already used!')
            }
        })
    }),
    check('username').not().isEmpty().withMessage("The username field is required!")
    .custom((value,{ req }) => {
        return Users.findOne({username: value})
        .then((user) => {  
            if(user){
                return Promise.reject('username has been already used!')
            }
        })
    }),
    body('name').not().isEmpty().withMessage("The Name field is required!"),
    body('position').not().isEmpty().withMessage("The Position field is required!"),
    body('password').not().isEmpty().withMessage("The Password Field is required!"),
    (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400,'Validation Error!',{ errors: errors.array() },res);
        }else{
            base.register(req, res);
        }
});


router.post('/login',
    check('username').not().isEmpty().withMessage("Username is required!"),
    body('password').not().isEmpty().withMessage("Password is required!"),
    (req, res)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400,'Validation Error!',{ errors: errors.array() },res);
        }else{   
            base.login(req, res);
        }
});

router.post('/checksponsor', 
    body('sponsorname').not().isEmpty().withMessage("The sponsorname field is required!"),
    (req, res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400,'Validation Error!',{ errors: errors.array() },res);
        }else{
           
            base.checkSponsor(req, res)
        }
});

router.get('/getliveamount',
    async (req, res) => {
        config.getLiveAmount(req, res)
    });


module.exports = router; 