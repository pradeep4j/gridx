const config = require("../config/config");
const Users = require("../models/Users");
const ChildCounter = require("../models/ChildCounter");
const BuyToken = require("../models/BuyToken");
const WalletRequest = require("../models/WalletRequest");
const bcrypt = require('bcryptjs');
const UserLog = require("../models/UserLog");
const P2pTran = require("../models/P2pTran");
const IncomHistory = require("../models/IncomHistory");

const baseController = {};

baseController.register = function (req, res) {
    req.body.username = req.body.username.trim();
    username = req.body.username.slice(0,3);
    req.body.username = (username != 'GDX') ? 'GDX'+req.body.username : req.body.username; 
    if(req?.body?.sponsor != undefined){
        req.body.sponsor = req.body.sponsor.trim();
        spon = req.body.sponsor.slice(0,3);
        req.body.sponsor = (spon != 'GDX') ? 'GDX'+req.body.sponsor : req.body.sponsor; 
    }
    Users.findOne({ username: req.body.username }, async (err, user) => {
        if (err) {
            config.response(500, 'Internal Server Error!', {}, res);
        }
        else if (user == undefined) {
            const spons = await config.getSponserId(req.body.sponsor, res);
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otp_type = Date.now();
            const registerUser = new Users({
                sponsor: spons?._id?.toString(),
                name: req.body.name,
                username: req.body.username,
                position: req.body.position,
                email: req.body.email,
                mobile: req.body.mobile,
                image: req.body.image,
                otp: otp,
                otp_time: otp_type,
                parentId: await config.getParentId(spons, req.body.position, res),
                password: await config.hashPassword(req.body.password, res),
                status: 1,
            });  

            // generating registration token
            const token = await registerUser.authToken();
            registerUser.save().then(() => {
                config.binaryCount(registerUser._doc._id);
                const childcounter = new ChildCounter({
                    uid: registerUser._doc._id,
                });
                childcounter.save()
                var data = { ...registerUser._doc }
                const html = '<h1>' + registerUser._doc.otp + '</h1>';
                config.sendMail(registerUser._doc.email, "Login Alert!", html);
                config.response(200, 'Congratulations you are now registered with GridX!', data, res);


            }).catch((error) => {
                console.log(error);
                config.response(500, 'Internal Server Error!', {}, res);
            });
        } else {
            config.response(201, 'User Already Registered!', {}, res);
        }
    })
}

baseController.login = function (req, res) {
    req.body.username = req.body.username.trim();
    username = req.body.username.slice(0,3);
    req.body.username = (username != 'GDX') ? 'GDX'+req.body.username : req.body.username; 
    Users.findOne({ username: req.body.username, status: true }, (err, user) => {
        if (err) {
            config.response(500, 'Internal Server Error!', {}, res);
        } else if (user == undefined) {
            config.response(201, 'User Not Found!', {}, res);
        } else {
            bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
                if (err) {
                    config.response(500, 'Internal Server Error!', {}, res);
                } else if (isMatch === true) {
                    const token = await user.authToken();

                    var data = { ...user._doc }

                    const html = 'You just got logged in to a device!';
                    config.sendMail(user.email, "Login Alert!", html);

                    config.response(200, 'Login successfull!', data, res);
                } else {
                    config.response(201, 'Invalid Credentials!', {}, res);
                }
            })
        }
    })
}
//wallet Request 
baseController.walletrequest = async (req, res, username) => {
    const userexist = await Users.findOne({ username: username });
    if (userexist) {
        const checkWalletRequest = await WalletRequest.findOne({ hash: req.body.hash });
        if (checkWalletRequest == null) {
            const walletrequest = new WalletRequest({
                userId: userexist._id.toString(),
                hash: req.body.hash,
                gdxamount: req.body.gdxamount,
            });
            walletrequest.save().then(() => {
                var data = { ...walletrequest._doc }
                const html = '<h6> Dear user ' + username + ' Your Wallet Request Successfully Registered Wait For Approved</h6>';
                config.response(200, 'Request Successfully Registered!', data, res);
            }).catch((error) => {
                console.log(error);
                config.response(500, 'Internal Server Error!', {}, res);
            });
        } else {
            config.response(201, 'Hash already Used!', {}, res);
        }
    }
    else {
        config.response(201, 'Invalid User!', {}, res);
    }


}

baseController.fundRequestList = async (req, res, next) => {
    try {
        const walletRequest = await WalletRequest.find({ userId: req._id.toString() }).sort({ created_at: -1 });
        if (walletRequest.length > 0) {
            config.response(200, 'Fund Request List Get Successfully!', walletRequest, res);
        } else {
            config.response(200, 'No Fund Request Found!', {}, res);
        }
    } catch (error) {
        next(error);
    }
}

baseController.BuyToken = async (req, res, created_by) => {
    const transaction_id = config.guid();
    const userexist = await Users.findOne({ username: req.body.username });
    const userextwalet = await Users.findOne({ _id: created_by });
    const getuserid = await Users.findOne({ tokens: [req.token] });

    if (userexist) {
        let usdamount;
        let walletamount;
        let gdxamount;
        const liveRate = await config.getLiveRateAmount();
        if (req.body.wallettype == 'gdx') {
            //usdamount = ((req.body.gdxamount) * (liveRate.data.result.message));
            gdxamount = ((req.body.gdxamount) / (liveRate.data.result.message));
            walletamount = userextwalet.externalGDXWallet;
        }
        else {
            gdxamount = req.body.gdxamount;
            // usdamount = req.body.gdxamount;
            walletamount = userextwalet.externalWallet;
            //gdxamount = ((req.body.gdxamount) / (liveRate.data.result.message));
        }
        if (gdxamount <= walletamount) {
            const buytokendata = await BuyToken.find({ userId: userexist._id.toString() });
            if (buytokendata.length == 0) {
                const buytoken = new BuyToken({
                    transactionId: transaction_id,
                    gdxamount: ((req.body.gdxamount) / (liveRate.data.result.message)),
                    userId: userexist._id.toString(),
                    usdamount: req.body.gdxamount,
                    tokenType: req.body.wallettype,
                    "status": 1,
                    createdBy: created_by.toString(),
                });
                buytoken.save().then(async () => {
                    var data = { ...buytoken._doc };
                    const userfilter = { _id: userexist._id };
                    const userdate = { activ_member: 1 };
                    const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                        returnOriginal: false
                    }).exec(async (err, response) => {
                    })
                    await config.directSponsorCommission(req.body.username, req.body.gdxamount);
                    await config.binaryPVCount(req.body.username, req.body.gdxamount);
                    await config.binaryCommissionFun(req, res);

                    if (req.body.wallettype == 'gdx') {
                        const incomHistory = new IncomHistory(
                            {
                                userId: userextwalet?._id?.toString(),
                                amount: req.body.gdxamount,
                                type: 'activate key',
                                category: 'debit',
                                status: 1,
                                description: 'activate key : ' + req.body.gdxamount,
                            });
                        incomHistory.save().then(async () => {
                            const userwalletwallet = userextwalet.externalGDXWallet - (((req.body.gdxamount) / (liveRate.data.result.message)));
                            const userfilter = { _id: getuserid._id };
                            const userdate = { externalGDXWallet: userwalletwallet };
                            const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                                returnOriginal: false
                            }).exec(async (err, response) => {
                            })
                        })
                    }
                    else {
                        const incomHistory = new IncomHistory(
                            {
                                userId: userextwalet?._id?.toString(),
                                amount: req.body.gdxamount,
                                type: 'activate key',
                                category: 'debit',
                                status: 1,
                                description: 'activate key : $ ' + req.body.gdxamount,
                            });
                        incomHistory.save().then(async () => {
                            const userwalletwallet = userextwalet.externalWallet - req.body.gdxamount;
                            const userfilter = { _id: getuserid._id };
                            const userdate = { externalWallet: userwalletwallet };
                            const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                                returnOriginal: false
                            }).exec(async (err, response) => {
                            })
                        })
                    }

                    const html = '<h6> Dear user ' + req.body.username + ' Your Wallet Request Successfully Registered Wait For Approved</h6>';
                    // config.sendMail(registerUser._doc.email,"Login Alert!",html);
                    config.response(200, 'Buy Token Request Registered!', data, res);

                }).catch((error) => {
                    console.log(error);
                    config.response(500, 'Internal Server Error!', {}, res);
                });

            }
            else {
                var totalBusiness = await config.selfBusiness(userexist._id.toString());
                totalBusiness = ((totalBusiness * 3) * 0.75);
                if (userexist.wallet >= totalBusiness) {
                    const buytoken = new BuyToken({
                        transactionId: transaction_id,
                        gdxamount: ((req.body.gdxamount) / (liveRate.data.result.message)),
                        userId: userexist._id,
                        usdamount: req.body.gdxamount,
                        tokenType: req.body.wallettype,
                        createdBy: created_by,
                    });
                    buytoken.save().then(async () => {
                        var data = { ...buytoken._doc };
                        const userfilter = { _id: userexist._id };
                        const userdate = { activ_member: 1, renewalStatus: 1 };
                        const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                            returnOriginal: false
                        }).exec(async (err, response) => {
                        })
                        await config.binaryPVCount(req.body.username, req.body.gdxamount);
                        await config.binaryCommissionFun(req, res);
                        if (req.body.wallettype == 'gdx') {
                            const incomHistory = new IncomHistory(
                                {
                                    userId: userextwalet?._id?.toString(),
                                    amount: req.body.gdxamount,
                                    type: 'activate key',
                                    category: 'debit',
                                    status: 1,

                                    description: 'activate key retopup: gdx ' + req.body.gdxamount,
                                });
                            incomHistory.save().then(async () => {
                                const userwalletwallet = userextwalet.externalGDXWallet - usdamount;
                                const userfilter = { _id: getuserid._id };
                                const userdate = { externalGDXWallet: userwalletwallet };
                                const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                                    returnOriginal: false
                                }).exec(async (err, response) => {
                                })
                            })
                        }
                        else {
                            const incomHistory = new IncomHistory(
                                {
                                    userId: userextwalet?._id?.toString(),
                                    amount: req.body.gdxamount,
                                    type: 'activate key',
                                    category: 'debit',
                                    status: 1,
                                    description: 'activate key retopup: $ ' + req.body.gdxamount,
                                });
                            incomHistory.save().then(async () => {
                                const userwalletwallet = userextwalet.externalWallet - req.body.gdxamount;
                                const userfilter = { _id: getuserid._id };
                                const userdate = { externalWallet: userwalletwallet };
                                const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                                    returnOriginal: false
                                }).exec(async (err, response) => {
                                })
                            })
                        }
                        const html = '<h6> Dear user ' + req.body.username + ' Your Wallet Request Successfully Registered Wait For Approved</h6>';
                        // config.sendMail(registerUser._doc.email,"Login Alert!",html);
                        config.response(200, 'Buy Token Request Registered!', data, res);

                    }).catch((error) => {
                        console.log(error);
                        config.response(500, 'Internal Server Error!', {}, res);
                    });
                } else {
                    config.response(200, 'Id is Already Activated!', {}, res);
                }
            }
        }
        else {
            config.response(500, 'Insufficient funds!', {}, res);
        }

    }
    else {
        config.response(500, 'User is not Exist!', {}, res);
    }
}

baseController.checkSponsor = async (req, res) => {
    spon = req.body.sponsorname.slice(0,3);
    req.body.sponsorname = (spon != 'GDX') ? 'GDX'+req.body.sponsorname : req.body.sponsorname; 
    const userexist = await Users.findOne({ username: req.body.sponsorname });
    if (userexist != null) {
        config.response(200, 'Sponsor successfully found!', [{name:userexist.name}], res);
    }
    else {
        config.response(201, 'Invalid Sponsor!', {}, res);
    }
}


// baseController.treesecondlevel = async (req, res) => {
//     var sponsorid
//     if (req.body.username) {
//         sponsorid = req.body.username;
//     }
//     else {
//         sponsorid = req.user;
//     }
//     const gotparentID = await Users.findOne({ username: sponsorid });
//     const userexist = await Users.find({ parentId: gotparentID._id.toString() });
//     config.response(200, 'users', userexist, res);
// }

baseController.treesecondlevel = async (req, res, next) => {
    try {
        if (req.body.username) {
            sponsorid = req.body.username;
        }
        else {
            sponsorid = req.user;
        }
        const gotparentID = await Users.findOne({ username: sponsorid });
        if (gotparentID == null) {
            config.response(201, 'Invalid Id!', {}, res);
        } else {
            const treedata = await Users.aggregate([
                {
                    $addFields: {
                        "usersid": { $toString: "$_id" }
                    }
                },
                {
                    $addFields: {
                        "sponsor": { $toObjectId: "$sponsor" }
                    }
                },
                {
                    $lookup:
                    {
                        from: 'childcounters',
                        localField: 'usersid',
                        foreignField: 'uid',
                        as: 'childcounters'
                    },
                },

                {
                    $lookup:
                    {
                        from: 'users',
                        localField: "sponsor",
                        foreignField: '_id',
                        as: 'sponsorData'
                    },
                },
                { $match: { parentId: gotparentID._id.toString() } },
                { "$sort": { "position": 1 } }
            ]);
            var data = treedata
            var datas = [];
            for (let d of data) {
                datas.push(await getDataObj(d));
            }
            config.response(200, 'Record Fetched Successfully!', datas, res);
        }
    } catch (error) {
        next(error);
    }
}

baseController.userProfile = async (req, res) => {
    const gotparentID = await Users.findOne({ username: req.body.username });
    var sponsorid
    if (req.body.username) {
        if (gotparentID == null) {
            config.response(400, 'invalid user!', {}, res);
            return;
        } else {
            sponsorid = gotparentID.tokens;
        }
    }
    else {
        sponsorid = [req.token];
    }
    //const gotparentID=await Users.findOne({token: [req.token]});
    Users.aggregate([
        {
            $addFields: {
                "usersid": { $toString: "$_id" }
            }
        },
        {
            $addFields: {
                "sponsor": { $toObjectId: "$sponsor" }
            }
        },
        {
            $lookup:
            {
                from: 'childcounters',
                localField: 'usersid',
                foreignField: 'uid',
                as: 'childcounters'
            },
        },
        {
            $lookup:
            {
                from: 'users',
                localField: "sponsor",
                foreignField: '_id',
                as: 'sponsorData'
            },
        },
        {
            $lookup:
            {
                from: "buytokens",
                localField: "usersid",
                foreignField: "userId",
                as: "activationData"
            }
        },
        { $match: { tokens: sponsorid } },
    ], async (err, profiledata) => {
        if (err) {
            config.response(500, 'Server Error!', {}, res);
        } else if (profiledata == undefined || profiledata == null || profiledata == '') {
            config.response(200, 'No Record Found!', {}, res);
        } else {
            var data = profiledata
            // const datas = data.map(getDataObj);
            var datas = [];
            for (let d of data) {
                datas.push(await getDataObj(d));
            }
            config.response(200, 'Record Fetched Successfully!', datas?.[0], res);
        }
    });
}

baseController.buyPackageReport = async (req, res) => {

    const gotparentID = await Users.findOne({ tokens: [req.token] });
    if (gotparentID) {
        BuyToken.aggregate([
            {
                $addFields: {
                    "_uid": { $toObjectId: "$userId" }
                }
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: '_uid',
                    foreignField: '_id',
                    as: 'users'
                },
            },

            //{$sort:{userId:gotparentID._id.toString()}}
            { $match: { createdBy: gotparentID._id.toString() } },
        ], (err, buytoken) => {
            if (err) {
                config.response(500, 'Server Error!', {}, res);
            } else if (buytoken == undefined || buytoken == null || buytoken == '') {
                config.response(200, 'No Record Found!', {}, res);
            } else {
                const datas = buytoken.map(getBuyToken)
                config.response(200, 'Record Fetched Successfully!', datas, res);
            }
        });
    }
    else {
        config.response(400, 'Invalid token!', {}, res);
    }

}

baseController.p2pTrans = async (req, res) => {
    const transaction_id = config.guid();
    const getuserid = await Users.findOne({ tokens: [req.token] });
    if (getuserid) {
        const getsenderuserid = await Users.findOne({ username: req.body.username });
        if (getsenderuserid) {
            let gdxamount = req.body.gdxamount;
            let usdamount = req.body.gdxamount * 1;
            let walletamount = (req.body.wallettype == 'USD') ? getsenderuserid.internalWallet : getsenderuserid.internalGDXWallet;
            if (gdxamount <= walletamount) {
                const p2pTran = new P2pTran({
                    transactionId: transaction_id,
                    gdxamount: gdxamount,
                    walletType: req.body.wallettype,
                    userId: getsenderuserid._id.toString(),
                    usdamount: usdamount,
                    status: getuserid.activ_member,
                    createdBy: getuserid._id.toString(),
                });
                p2pTran.save().then(async () => {
                    if (req.body.wallettype == 'USD') {
                        wallet = getsenderuserid.externalWallet + gdxamount;
                        update = { externalWallet: wallet };
                    } else {
                        wallet = getsenderuserid.externalGDXWallet + gdxamount;
                        update = { externalGDXWallet: wallet };
                    }
                    const filter = { _id: getsenderuserid._id };
                    const doc = await Users.findOneAndUpdate(filter, update, {
                        returnOriginal: false
                    }).exec(async (err, response) => {
                        if (req.body.wallettype == 'USD') {
                            userwalletwallet = getuserid.internalWallet - gdxamount;
                            userdate = { internalWallet: userwalletwallet };
                        } else {
                            userwalletwallet = getuserid.internalGDXWallet - gdxamount;
                            userdate = { internalGDXWallet: userwalletwallet };
                        }
                        const userfilter = { _id: getuserid._id };

                        const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                            returnOriginal: false
                        }).exec(async (err, response) => {
                            const incomHistory = new IncomHistory(
                                {
                                    userId: getsenderuserid?._id?.toString(),
                                    amount: gdxamount,
                                    type: 'p2ptrans',
                                    category: 'credit',
                                    status: getuserid.activ_member,
                                    description: 'Binary Comm : $ ' + gdxamount,
                                });
                            incomHistory.save().then(async () => {
                                const incomHistorydebi = new IncomHistory(
                                    {
                                        userId: getuserid?._id?.toString(),
                                        amount: gdxamount,
                                        type: 'p2ptrans',
                                        category: 'debit',
                                        status: getuserid.activ_member,
                                        description: 'Binary Comm : $ ' + gdxamount,
                                    });
                                incomHistorydebi.save().then(() => {
                                }).catch((error) => {
                                    config.response(500, 'Internal Server Error!', {}, res);
                                });
                            }).catch((error) => {
                                config.response(500, 'Internal Server Error!', {}, res);
                            });
                        });
                    });
                    var data = { ...p2pTran._doc };
                    config.response(200, 'P2P Transaction Request Registered!', data, res);
                }).catch((error) => {
                    config.response(500, 'Internal Server Error!', {}, res);
                });

            }
            else {
                config.response(500, 'Insufficient funds!', {}, res);
            }
        }
        else {
            config.response(500, 'Invalid User!', {}, res);
        }

    }
    else {
        config.response(400, 'Invalid token!', {}, res);
    }

}

baseController.checkuser = async (req, res, next) => {
    try {
        id = req.body.userId.slice(0,3);
        req.body.userId = (id != 'GDX') ? 'GDX'+req.body.userId : req.body.userId; 
        const userexist = await Users.findOne({ username: req.body.userId });
        if (userexist != null) {
            config.response(201, 'This user Id is already Taken!', [], res);
        }else {
            config.response(200, 'user Id is available!', [], res);
        }
    } catch (error) {
        next(error);
    }
}


baseController.forgotPassword = async (req, res, next) => {
    try {
        id = req.body.userId.slice(0, 3);
        req.body.userId = (id != 'GDX') ? 'GDX' + req.body.userId : req.body.userId;
        const userexist = await Users.findOne({ username: req.body.userId });
        if (userexist != null) {
            var otp = await config.generateOTP();
            Users.findOneAndUpdate({ _id: userexist._id }, { otp: otp, otp_time: new Date() }, {
                returnOriginal: false   
            }).exec(async (err, response) => { })
            var otpMethod = config.sendOtpMethod();
            if (otpMethod.includes("email")) {
                const content = 'Dear ' + userexist.name + ',Your one timepassword ' + otp + ' Please do not share with anyone. Regards support team';
                await config.sendMail(userexist.email, 'Otp Verification', content);
            }
            if (otpMethod.includes("mobile")) {
                const message = 'Dear%20User,%20Your%20one%20time%20password%20' + otp + '%20Please%20do%20not%20share%20with%20anyone.%20Regards%20support%20team';
                await config.sendOtp(userexist.mobile, message);
            }
            config.response(200, 'Otp has been Sent ,Please Check!', {}, res);
        } else {
            config.response(201, 'User not found!', [], res);
        }
    } catch (error) {
        next(error);
    }
}


baseController.forgotPasswordSave = async (req, res, next) => {
    try {
        id = req.body.userId.slice(0, 3);
        req.body.userId = (id != 'GDX') ? 'GDX' + req.body.userId : req.body.userId;
        const userexist = await Users.findOne({ username: req.body.userId });
        if (userexist != null) {
            if (userexist.otp != req.body.otp) {
                config.response(400, 'Incorrect OTP!', [], res);
            } else {
                var expiretime = new Date(userexist.otp_time);
                var currenttime = new Date();
                expiretime.setMinutes(expiretime.getMinutes() + config.getOTPExpireTime());
                if (currenttime <= expiretime) {
                    Users.findOneAndUpdate({ username: req.body.userId }, { $set: { password: config.hashPassword(req.body.newPassword), updated_at: new Date(), otp: null, otp_time: null } }).exec((err, ChangeRes) => {
                        config.response(200, 'Password Has Been Reset successfully!', [ChangeRes], res);
                    });
                } else {
                    config.response(400, 'OTP has been Expired!', [], res);
                }
            }
        } else {
            config.response(201, 'User not found!', [], res);
        }
    } catch (error) {
        next(error);
    }
}

const getDataObj = async (treedata) => {
    ord = {
        "_id": treedata._id,
        "name": treedata.name,
        "username": treedata.username,
        "email": treedata.email,
        "mobile": treedata.mobile,
        "wallet": treedata.wallet,
        "directWallet": treedata.directWallet,
        "binaryWallet": treedata.binaryWallet,
        "withdrawalAmount": treedata.withdrawalAmount,
        "externalWallet": treedata.externalWallet,
        "internalGDXWallet": treedata.internalGDXWallet,
        "externalGDXWallet": treedata.externalGDXWallet,
        "roiWallet": treedata.roiWallet,
        "shibawallet": treedata.shibaWallet,
        "babydogewallet": treedata.babyDogeWallet,
        "gridxwallet": treedata.gridxWallet,
        "activ_member": treedata.activ_member,
        "position": treedata.position,
        "address": treedata.address,
        "nameChangeStatus": treedata.nameChangeStatus != undefined ? treedata.nameChangeStatus : 0,
        "sv": treedata.sv,
        "ev": treedata.ev,
        "left_pv": treedata.childcounters?.[0]?.left_pv,
        "right_pv": treedata.childcounters?.[0]?.right_pv,
        "total_left_pv": treedata.childcounters?.[0]?.left_pv,
        "total_right_pv": treedata.childcounters?.[0]?.left_pv,
        "uleftcount": treedata.childcounters?.[0]?.uleftcount,
        "urightcount": treedata.childcounters?.[0]?.urightcount,
        "total_leftcount": treedata.childcounters?.[0]?.total_leftcount,
        "sponsor_name": treedata.sponsorData?.[0]?.name,
        "sponsor_username": treedata.sponsorData?.[0]?.username,
        "selfBusiness": await config.selfBusiness(treedata._id.toString()),
        "directBusiness": await config.directBusiness(treedata._id.toString()),
        "directActiveMember": await Users.find({ sponsor: treedata._id.toString(), activ_member: '1' }).count(),
        "activeLeftMember": await config.activeMemberPosition(treedata._id.toString(), 'L'),
        "activeRightMember": await config.activeMemberPosition(treedata._id.toString(), 'R'),
        "activationAmount": (treedata?.activationData != undefined && treedata?.activationData[0]?.usdamount) ? treedata?.activationData[0]?.usdamount : 0,
        gdxAddressChangeStatus: (treedata.address != undefined && treedata.address != '') ? false : true
    }
    return ord;
};

const getBuyToken = (buytoken) => {
    const ord = {
        "_id": buytoken._id,
        "transactionId": buytoken.transactionId,
        "gdxamount": buytoken.gdxamount,
        "usdamount": buytoken.usdamount,
        "status": buytoken.status,
        "tokenType": buytoken.tokenType,
        "name": buytoken.users?.[0]?.name,
        "username": buytoken.users?.[0]?.username,
        "created_at": buytoken.created_at
    }
    return ord;
};

module.exports = baseController;