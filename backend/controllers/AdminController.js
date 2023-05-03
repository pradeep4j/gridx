const config = require("../config/config");
const Users = require("../models/Users");
const BuyToken = require("../models/BuyToken");
const PinSystem = require("../models/PinSystem");
const WalletRequest = require("../models/WalletRequest");
const IncomHistory = require("../models/IncomHistory");
const GeneralSetting = require("../models/GeneralSetting");
const adminController = {};
adminController.updateSetting = async (req, res, next) => {
    try {
        const { type, value } = req.body;
        const generalSettings = await GeneralSetting.find({});
        if (generalSettings.length == 0) {
            var generalSettingSave = new GeneralSetting({
                [type]: value,
            });
            generalSettingSave.save();
            return config.response(200, 'GDX rate is updated Successfully!', [], res);
        } else {
            GeneralSetting.findOneAndUpdate({ _id: generalSettings[0]._id }, { [type]: value, updated_at: new Date() }, {
                returnOriginal: false
            }).exec(async (err, response) => {
                if (err) {
                    return config.response(201, 'Server Error!', [], res);
                } else {
                    return config.response(200, 'GDX rate is updated Successfully!!', [], res);
                }
            })
        }
    } catch (error) {
        next(error);
    }
}

adminController.getSetting = async (req, res, next) => {
    try {  
        const generalSettings = await GeneralSetting.find({});
        if (generalSettings.length == 0) {
            return config.response(201, 'No Any Record Found!!', [], res);
        } else {
            if (req?.body?.type != undefined && req?.body?.type != "") {
                record = generalSettings[0][req?.body?.type];
                return config.response(200, 'Record Found Successfully!!', { [req?.body?.type]: record }, res);
            } else {
                return config.response(200, 'Record Found Successfully!!', generalSettings, res);
            }
        }
    } catch (error) {
        next(error);
    }
}
adminController.PinSystem = async (req, res) => {
    try {
        const transaction_id = config.guid();
        //   console.log(req.body)
        const userexist = await Users.findOne({ username: req.body.username });
        if (userexist != null) {
            if (userexist.activ_member == 1) {
                return config.response(201, 'Id is Already Activated!', {}, res);
            }
            let usdamount;
            let gdxamount;
            let liveRate = await config.getLiveRateAmount();
            if (req.body.wallettype == 'gdx') {
                usdamount = ((req.body.gdxamount) * (liveRate.data.result.message));
                gdxamount = req.body.gdxamount;
            } else {
                usdamount = req.body.gdxamount;
                gdxamount = ((req.body.gdxamount) / (liveRate.data.result.message));
            }
            const buytokendata = await BuyToken.find({ userId: userexist._id.toString() });
            if (buytokendata.length == 0) {
                const buytoken = new BuyToken({
                    transactionId: transaction_id,
                    gdxamount: gdxamount,
                    userId: userexist._id.toString(),
                    usdamount: usdamount,
                    tokenType: req.body.wallettype,
                    "status": 1,
                    "pintype": req.body.pintype,
                    createdBy: '641c45a3ece066ff0aeb01b3',
                });
                buytoken.save().then(async () => {
                    var data = { ...buytoken._doc };
                    const userfilter = { _id: userexist._id };
                    const userdate = { activ_member: 1 };
                    const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                        returnOriginal: false
                    }).exec(async (err, response) => {
                    })
                    const pinsystem = new PinSystem({
                        transactionId: transaction_id,
                        gdxamount: gdxamount,
                        userId: userexist._id.toString(),
                        usdamount: usdamount,
                        tokenType: req.body.wallettype,
                        "pintype": req.body.pintype,
                        createdBy: '641c45a3ece066ff0aeb01b3',
                    });
                    pinsystem.save().then(() => {
                        if (req.body.pintype == 3) {
                            config.directSponsorCommission(req.body.username, req.body.gdxamount);
                            config.binaryPVCount(req.body.username, req.body.gdxamount);
                            config.binaryCommissionFun(req, res);
                        }
                    })
                    //const html = '<h6> Dear user ' + req.body.username + ' Your Wallet Request Successfully Registered Wait For Approved</h6>';
                    // config.sendMail(registerUser._doc.email,"Login Alert!",html);
                    config.response(200, 'Buy Token Request Registered!', data, res);
                }).catch((error) => {
                    console.log(error);
                    config.response(500, 'Internal Server Error!', {}, res);
                });
            } else {
                config.response(201, 'Id is Already Activated!', {}, res);
            }
        } else {
            config.response(201, 'Invalid User!', {}, res);
        }
    }
    catch (error) {
        next(error);
    }
}

adminController.walletRequest = async (req, res, next) => {
    try {
        var query = {};
        if ((req.body.status != undefined && req.body.status != '') || req.body.status == 0) {
            query = { ...query, status: req.body.status };
        }
        if (req?.body?.range != undefined && req?.body?.range != '') {
            query = {
                ...query, created_at: {
                    $gte: new Date(new Date(req?.body?.range[0]).setHours(00, 00, 00)),
                    $lt: new Date(new Date(req?.body?.range[1]).setHours(23, 59, 59))
                }
            }
        }
        if (req?.body?.page != undefined) {
            skip = (req?.body?.page - 1) * 10;
            userexist = await WalletRequest.aggregate([
                {
                    $addFields: {
                        "userId": { $toObjectId: "$userId" }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $match: { ...query } },
                { $sort: { created_at: -1 } },
                { $skip: skip },
                { $limit: 10 }
            ]);
        } else {
            userexist = await WalletRequest.aggregate([
                {
                    $addFields: {
                        "userId": { $toObjectId: "$userId" }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $match: { ...query } },
                { $sort: { created_at: -1 } }
            ]);
        }
        const fundRequestList = [];
        userexist.map((fund) => {
            if (req?.body?.username != undefined && req?.body?.username == fund?.user[0]?.username) {
                d = { ...fund, hashUrl: 'https://bscscan.com/tx/' + fund.hash, userName: fund?.user[0]?.name, userId: fund?.user[0]?.username };
            } else {
                d = { ...fund, hashUrl: 'https://bscscan.com/tx/' + fund.hash, userName: fund?.user[0]?.name, userId: fund?.user[0]?.username };
            }
            delete d.user;
            fundRequestList.push(d);
        });
        if (fundRequestList.length == 0) {
            config.response(200, 'No Data Found!', {}, res);
        } else {
            config.response(200, 'Success!', fundRequestList, res);
        }
    } catch (error) {
        next(error);
    }
}
adminController.usersList = async (req, res, next) => {
    try {
        let query = {};
        // if(req?.body?.name != undefined && req?.body?.name != ''){
        //     query = {...query,name:req?.body?.name}
        // }
        usernameSearch = req.body.search.trim();
        username = usernameSearch.slice(0, 3);
        usernameSearch = (username != 'GDX') ? 'GDX' + usernameSearch : usernameSearch;
        if (req?.body?.search != undefined && req?.body?.search != '') {
            if (isNaN(parseInt(req?.body?.search)) === false) {
                query = { ...query, $or: [{ mobile: req?.body?.search }, { username: usernameSearch }] }
            } else {
                query = { ...query, $or: [{ name: req?.body?.search }, { email: req?.body?.search }, { username: usernameSearch }, { address: req?.body?.search }] }
            }
        }
        // if(req?.body?.email != undefined && req?.body?.email != ''){
        //     query = {...query,email:req?.body?.email}
        // }
        // if(req?.body?.username != undefined && req?.body?.username != ''){
        //     query = {...query,username:req?.body?.username}
        // }
        // if(req?.body?.address != undefined && req?.body?.address != ''){
        //     query = {...query,address:req?.body?.address}
        // }
        if (req?.body?.range != undefined && req?.body?.range != '') {
            query = {
                ...query, created_at: {
                    $gte: new Date(new Date(req?.body?.range[0]).setHours(00, 00, 00)),
                    $lt: new Date(new Date(req?.body?.range[1]).setHours(23, 59, 59))
                }
            }
        }

        let countData = await Users.find({ ...query }).count();
        if (req?.body?.page != undefined) {
            skip = (req?.body?.page - 1) * 10;
            list = await Users.find({ ...query }).sort({ created_at: -1 }).skip(skip).limit(10);
        } else {
            list = await Users.find({ ...query }).sort({ created_at: -1 });
        }
        // console.log(list)
        if (list.length > 0) {
            config.response(200, 'Users Fetched Successfully!', [{ users: list, totalUser: countData }], res);
        } else {
            config.response(201, 'No Data Found!', {}, res);
        }
    } catch (error) {
        next(error);
    }
}
adminController.updateUser = async (req, res, next) => {
    try {
        const { id, username, name, mobile, email, password, address } = req.body;
        const user = await Users.findOne({ _id: id });
        if (user == null) {
            return config.response(201, 'Invalid id!', {}, res);
        }
        if (username != undefined && username != '') {
            checkcon = await config.checkUserExists('username', username, id);
            if (checkcon != null) {
                return config.response(201, 'Username Already Exists!', {}, res);
            }
        }
        if (mobile != undefined && mobile != '') {
            checkcon = await config.checkUserExists('mobile', mobile, id);
            if (checkcon != null) {
                return config.response(201, 'mobile Already Exists!', {}, res);
            }
        }
        if (email != undefined && email != '') {
            checkcon = await config.checkUserExists('email', email, id);
            if (checkcon != null) {
                return config.response(201, 'email Already Exists!', {}, res);
            }
        }
        let update = { username: username, name: name, mobile: mobile, email: email, address: address };
        if (password != undefined && password != '') {
            update = { ...update, password: await config.hashPassword(password) }
        }
        Users.findOneAndUpdate({ _id: id }, update, {
            returnOriginal: false
        }).exec(async (err, response) => {
            if (err) {
                return config.response(201, 'Server Error!', [], res);
            } else {
                return config.response(200, 'User Updated Successfully!!', [], res);
            }
        })
    } catch (error) {
        next(error);
    }
}
adminController.approveRejectWalletRequest = async (req, res, next) => {
    try {
        const { requestId, type, remarks } = req.body;
        const walletrequest = await WalletRequest.findOne({ _id: requestId });
        if (walletrequest != null && walletrequest.status == 0) {
            if (type == 'Approve') {
                const userexist = await Users.findOne({ _id: walletrequest.userId });
                const userfilter = { _id: userexist._id };
                const walletrequestdata = userexist.externalGDXWallet + walletrequest.gdxamount;
                const userdate = { externalGDXWallet: walletrequestdata };
                const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                    returnOriginal: false
                }).exec(async (err, response) => {
                    const walletfilter = { _id: walletrequest._id };
                    const userdate = { status: 1, remarks: remarks };
                    const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
                        returnOriginal: false
                    }).exec(async (err, response) => {
                        const incomHistory = new IncomHistory(
                            {
                                userId: walletrequest.userId,
                                amount: walletrequest.gdxamount,
                                type: 'wallet_request',
                                category: 'credit',
                                status: 1,
                                description: 'Wallet Request And Approved By Admin $' + walletrequest.gdxamount,
                            });
                        incomHistory.save().then(async () => {
                            config.response(200, 'Fund Request Approved Successfully!', {}, res);
                        })
                    })
                })
            } else {
                const walletfilter = { _id: requestId };
                const userdate = { status: 2, remarks: remarks };
                const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
                    returnOriginal: false
                }).exec(async (err, response) => {
                    config.response(200, 'Fund Request Rejected Successfully!', {}, res);
                })
            }
        } else {
            config.response(200, 'No Pending Request Found!', {}, res);
        }
    } catch (error) {
        next(error);
    }
    
    // const walletrequest = await WalletRequest.findOne({_id:req.body.id});
    // if(req.body.type==1)
    // {
    //     const userexist = await Users.findOne({ _id: ObjectId(walletrequest.userId) });
    //     const userfilter = { _id: userexist._id };
    //     const walletrequestdata=walletrequestdata+walletrequest.gdxamount;
    //     const userdate = { externalWallet: walletrequestdata};
    //     const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
    //             returnOriginal: false
    //         }).exec(async(err, response) => {
    //             const walletfilter = { _id: walletrequest._id };
    //             const userdate = { status: 1,description:req.body.description};
    //             const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
    //                 returnOriginal: false
    //             }).exec(async(err, response) => {

    //             })
    //     })
    // }
    // else
    // {
    //     const walletfilter = { _id: walletrequest._id };
    //     const userdate = { status:2,description:req.body.description};
    //     const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
    //         returnOriginal: false
    //     }).exec(async(err, response) => {

    //     })

    // }
    // const incomHistory = new IncomHistory(
    //     {
    //         userId: walletrequest.userId,
    //         amount: walletrequest.gdxamount,
    //         type: 'wallet_request',
    //         category: 'debit',
    //         status: req.body.type,
    //         description: 'Wallet Request And Approved By Admin $' + walletrequest.gdxamount,
    //     });
    // incomHistory.save().then(async () => {

    // })
}

module.exports = adminController;

