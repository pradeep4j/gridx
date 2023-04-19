var express = require('express');
const { check, body, validationResult } = require('express-validator');
const config = require('../config/config');
const Users = require('../models/Users');
var admincon = require("../controllers/AdminController");
var router = express.Router();
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

router.post('/walletrequest', (req, res) => {
    admincon.walletRequest(req, res);
});

module.exports = router; 