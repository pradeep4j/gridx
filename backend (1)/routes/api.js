var express = require('express');
var router = express.Router();

const baseRoutes = require('./api.routes');
const userRoutes = require('./user');
const adminRouter = require('./admin');

//Login super & other
/*------------------------------api routing-----------------------*/
router.use('/',baseRoutes);
router.use('/user',userRoutes);
router.use('/admin',adminRouter);
/*------------------------------End api routing-------------------*/

module.exports = router;