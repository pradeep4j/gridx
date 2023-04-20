var express = require('express');
const {protectRoute,isAdmin} = require('../utils/authmiddleware');
const Users = require('../models/users');
var {login,logout,register,addoffer,addnews,getnewsbyId} = require("../controllers/AdminPanelController");
var router = express.Router();

router.route('/login').post(login);
router.route('/logout').get(protectRoute,logout);
router.route('/register').post(register);
router.route('/addoffer').post(addoffer);
router.route('/addnews').post(addnews);
router.route('/getnewsbyId/:id').get(getnewsbyId);

module.exports = router; 