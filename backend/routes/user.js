var express = require('express');
const { check, body, validationResult } = require('express-validator');
const config = require('../config/config');
const Users = require('../models/Users');
var base = require("../controllers/BaseController");
const authenticate = require('../middleware/checkvary');
const authenticateToken = require('../middleware/authenticatetoken');
var usercon = require("../controllers/UserController");
var router = express.Router();

router.get('/userverification', authenticateToken,
    body('otp').not().isEmpty().withMessage("The otp field is required!"),
    (req, res) => {
        const username = `${req.user}`;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            config.checkValidCode(username, req.body.otp, res)
        }
    });

//config.checkValidCode(user, $code, $add_min = 10000)
//     {

//         if (!$code) return false;
//         if (!$user->ver_code_send_at) return false;
//         $data=$user->ver_code_send_at;
//     	$ver_code_send_at= Carbon::createFromFormat('Y-m-d H:i:s', $data);

//         if ($ver_code_send_at->addMinutes($add_min) < Carbon::now()) return false;
//         if ($user->ver_code !== $code) return false;
//         return true;
//     }
router.use(authenticateToken);
router.post('/package',
    check(
        'gdxamount',
        'amount must be a number between 50 and 1000'
    ).isInt({ min: 50, max: 1000 }),
    body('gdxamount').not().isEmpty().withMessage("The amount field is required!"),
    body('username').not().isEmpty().withMessage("The username Field is required!"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            const username = `${req.user}`;
            const userexist = await Users.findOne({ username: username });

            if (userexist) {
                //console.log(userexist);
                base.BuyToken(req, res, userexist._id);
            }
            else {
                config.response(400, 'Invalid Token!', {}, res);
            }
        }

    });
router.post('/walletrequest',
    body('gdxamount').not().isEmpty().withMessage("The amount field is required!"),
    body('hash').not().isEmpty().withMessage("The hash Field is required!"),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        } else {
            const username = `${req.user}`;
            base.walletrequest(req, res, username)
        }

    });


router.post('/fundRequestList',async (req, res, next) => {
    base.fundRequestList(req, res, next)
});

router.post('/treesecondlevel',
    (req, res) => {
        base.treesecondlevel(req, res)

    });

router.post('/userprofile',
    (req, res) => {
        base.userProfile(req, res)
    });

router.post('/buypackagereport',
    (req, res) => {
        base.buyPackageReport(req, res)
    });

router.post('/p2ptran',
    check(
        'gdxamount',
        'amount must be a number'
    ).isInt({ min: 0 }),
    body('gdxamount').not().isEmpty().withMessage("The amount field is required!"),
    body('username').not().isEmpty().withMessage("The username field is required!")
    , (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            config.response(400, 'Validation Error!', { errors: errors.array() }, res);
        }
        else {
            base.p2pTrans(req, res)
        }

    });

router.post('/checkuser',
    (req, res) => {
        usercon.checkUser(req, res)
    });

router.post('/dashboardapi',
    (req, res) => {
        usercon.dashboardApi(req, res)
    });
router.post('/sponsorbusiness', (req, res) => {
    var getallid = [];
    const data = config.recLevelChild(req._id.toString(), req);

    data.then(ress => {
        const childIdData = req.childId;
        if (childIdData.length - 1 == 0) {
            var child2data = childIdData.flat(childIdData.length);
        }
        else {
            var child2data = childIdData.flat(childIdData.length - 1);
        }
        const datas = child2data.map(getSponsorId);
        
        usercon.sponsorBusiness(req, res, datas)

    }).catch(err => console.log(err))
});

dataadd = [];
const getSponsorId = (data) => {
    //dataadd.push(data._id.toString());
    return data._id.toString();
}
router.post('/getteammember',
    async (req, res) => {
        const data = await config.totalTeamMemberID(req._id.toString());
        usercon.allTeamMember(req, res, data);
    });
const showdteammemberdata = (data) => {
    return data._id;
}

router.post('/dailyBonus', async(req, res) => {
    usercon.dailyBonusCron(req, res);
});

router.post('/get3Xamount', async(req, res) => {
    usercon.get3Xamount(req, res);
});
router.post('/transactionhistoryreport',(req, res) => {
    usercon.transactionHistoryReport(req, res)
});


router.post('/getMemberByLevel',(req, res,next) => {
    usercon.getMemberByLevel(req, res, next)
});
router.post('/getMyDownline',(req, res,next) => {
    usercon.getMyDownline(req, res, next)
});

router.post('/renualHistory',(req, res,next) => {
    usercon.renualHistory(req, res, next)
});

router.post('/updateProfile',(req, res,next) => {
    usercon.updateProfile(req, res, next);
});

router.post('/updateEmailMobile',
body('type').not().isEmpty().withMessage("The type field is required!"),
body('value').not().isEmpty().withMessage("The value field is required!"),
(req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        config.response(400, 'Validation Error!', { errors: errors.array() }, res);
    }else{
        usercon.updateEmailMobile(req, res, next);
    }
});

router.post('/otpVerifyAndUpdate',
body('type').not().isEmpty().withMessage("The type field is required!"),
body('value').not().isEmpty().withMessage("The value field is required!"),
body('otp').not().isEmpty().withMessage("The otp field is required!"),
(req, res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        config.response(400, 'Validation Error!', { errors: errors.array() }, res);
    }else{
        usercon.otpVerifyAndUpdate(req, res, next);
    }
});

router.post('/p2ptranHistory',(req, res,next) => {
    usercon.p2ptranHistory(req, res, next);
});

module.exports = router; 