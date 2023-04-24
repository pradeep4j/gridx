const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
var nodemailer = require('nodemailer');
const Users = require('../models/Users');
const IncomHistory = require('../models/IncomHistory');
const ChildCounter = require("../models/ChildCounter");
const {
    ObjectId
} = require('mongodb');
const { default: axios } = require('axios');
const DailyBusiness = require('../models/DailyBusiness');
const BuyToken = require('../models/BuyToken');
const DailyBonus = require('../models/DailyBonus');
dotenv.config();

const config = {};

config.hashPassword = (password) => {
    let salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(password, salt)
    return hashedPassword
}

config.currentTimeStamp = (timestamp)=> {
    const currentDate = new Date(timestamp);
    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth(); // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    // const currentHour = currentDate.getHours();
    // const currentMinute = currentDate.getMinutes();
    // const currentSeconds = currentDate.getSeconds();
    // const dateString = currentDayOfMonth + "-" + (currentMonth + 1) + "-" + currentYear;
    //const dateString = currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth +" "+currentHour+":"+currentMinute+":"+currentSeconds;
    const dateString = currentYear + "-" + (currentMonth + 1) + "-" + currentDayOfMonth;
    return dateString;
}

config.generateAccessToken = (email) => {
    //return jwt.sign(email, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });
    return jwt.sign(email, process.env.TOKEN_SECRET);
}

config.response = (rescode, message, data, res, extraData) => {
    data = (JSON.stringify(data) === '{}') ? {} : data;
    const status = rescode == 200 ? true : false;
    res.status(200).json({ data: data, message: message, status: status, ...extraData });
}

config.sendMail = (email, subject, content) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'support@softfix.in',
            pass: 'ifxceaitlbtquspe'
        }
    });

    var mailOptions = {
        from: 'support@softfix.in',
        to: email,
        subject: subject,
        html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

config.getSponserId = async (sponsor, res) => {
    if (sponsor == undefined) {
        return new Promise((resolve, reject) => {
            Users.findOne({ username: 'admin' }, (err, spons) => {
                if (err) {
                    reject(err);
                    config.response(500, 'Internal Server Error!', {}, res);
                } else if (spons == undefined) {
                    reject('Taxes Not Found!');
                    config.response(400, 'Invalid!', {}, res);
                } else {
                    resolve(spons);
                }
            })
        });
    } else {
        return new Promise((resolve, reject) => {
            Users.findOne({ username: sponsor }, (err, spons) => {
                if (err) {
                    reject(err);
                    config.response(500, 'Internal Server Error!', {}, res);
                } else if (spons == undefined) {
                    reject('Sponsor Not Found!');
                    config.response(400, 'Invalid Sponsor!', {}, res);
                } else {
                    resolve(spons);
                };
            })
        });
    };
}

config.getParentId = async (sponsor, position, res) => {

    return new Promise(async (resolve, reject) => {
        const userId = await Users.findOne({ _id: sponsor._id.toString() })
        if (userId) {
            const parent_id = userId._id.toString();
            Users.find({ parentId: parent_id, position: position }, async (err, parent) => {
                if (err) {
                    reject(err);
                    config.response(500, 'Internal Server Error!', {}, res);
                }
                else if (parent == undefined) {
                    reject('Internal Server Error!');
                    config.response(500, 'Internal Server Error!', {}, res);
                }
                else {
                    if (parent.length > 0) {
                        const sponsorChild = await Users.findOne({ parentId: parent_id, position: position });
                        resolve(config.getParentId(sponsorChild, position));
                    }
                    else {
                        resolve(userId._id.toString());
                    };
                }
            })
        }
        else {
            reject('Internal Server Error!');
            config.response(500, 'Parent Id not define!', {}, res);
        }
    });
}

config.binaryCount = async (id) => {
    return new Promise(async (resolve, reject) => {
        Users.find({ _id: id, }, async (err, parent1) => {
            if (err) {
                reject(err);
                config.response(500, 'Internal Server Error!', {});
            }
            else if (parent1 == undefined) {
                reject('Internal Server Error!');
                config.response(500, 'Internal Server Error!', {});
            }
            else {

                if (parent1.length > 0) {
                    var getuser = await Users.findOne({ _id: id });
                    const parent = getuser.parentId;
                    const sponsorChild = await Users.find({ _id: ObjectId(parent) });

                    if (sponsorChild.length > 0) {
                        const getParent = await Users.findOne({ _id: ObjectId(parent) });
                        const getChild_counter = await ChildCounter.findOne({ 'uid': parent });
                        if (getuser.position == 'L') {
                            const uleftcount = getChild_counter.uleftcount + 1;
                            const total_leftcount = getChild_counter.total_leftcount + 1;
                            const filter = { uid: getParent._id.toString() };
                            const update = { uleftcount: uleftcount, total_leftcount: total_leftcount };
                            const doc = await ChildCounter.findOneAndUpdate(filter, update, {
                                returnOriginal: false
                            }).exec((err, res) => {

                            });
                        }
                        if (getuser.position == 'R') {
                            const urightcount = getChild_counter.urightcount + 1;
                            const total_rightcount = getChild_counter.total_rightcount + 1;
                            const filter = { uid: getParent._id.toString() };
                            const update = { urightcount: urightcount, total_rightcount: total_rightcount };
                            const doc = await ChildCounter.findOneAndUpdate(filter, update, {
                                returnOriginal: false
                            }).exec((err, res) => {

                            });
                        }
                        config.binaryCount(getParent._id);
                    }
                }

            }
        })

    });
}

config.checkValidCode = async (user, code, res, add_min = 60*1000*10) => {
    const userdata = await Users.findOne({ username: user });
    const createotptime = new Date(userdata.otp_time);
    createotptime.setSeconds(createotptime.getSeconds() + add_min);
    if (createotptime <= new Date()) {
        if (userdata.otp !== code) {
            // console.log('OTP Is Not Match')
            config.response(200, 'Invalid OTP!', {}, res);
        }
        else {
            const filter = { _id: userdata._id };
            const update = { ev: 1, sv: 1, otp_time: null, otp: null };
            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {
            });
            config.response(200, 'Verified', {}, res);
        }
    }
    else {
        config.response(200, 'OTP Expired Please Resend', {}, res);
    }
}

config.directSponsorCommission = async (user_id, amount) => {

    const user = await Users.findOne({ username: user_id });
    let directbonus = user.directbonus;
    const sponsorid = user.sponsor;
    if (user.renewal_status == 1) {
        present = amount * 5 / 100;
    }
    else {
        present = amount * 5 / 100;
    }

    let sponsor = await Users.findOne({ _id: ObjectId(sponsorid) });
    if (sponsor.activ_member) {
        const babydogegwalletamt = 10000000;
        const gridxwalletamt= 1;
        const shibawalletamt = 100000;
        const totaldirectbonus = sponsor.directWallet + present;
        let   directbonus = totaldirectbonus;
        let   wallet = sponsor.wallet + present;
        let   internalWallet = sponsor.internalWallet + present;
        const gridxwallet = sponsor.gridxWallet + gridxwalletamt;
        const babydogeWallet = sponsor.babyDogeWallet + babydogegwalletamt;
        const shibawallet = sponsor.shibaWallet + shibawalletamt;

        //3X condition

        let check3XFun=await config.check3XFun(sponsor._id.toString());
         let check3XFunfinal=await config.check3XFunFinal(sponsor._id.toString(),check3XFun);
         if(check3XFunfinal[1]==false)
         {
            const filter = { _id: sponsor._id };
            const update = { activ_member: 0};

            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {

            });
            
            wallet=sponsor.wallet +0;
            directbonus=sponsor.directWallet + 0;
            internalWallet=sponsor.internalWallet + 0;
            sponsor.activ_member=0;
         }
         else
         {
               if(check3XFun[0].count*3<=wallet)
               {
                    walletdata=check3XFun[0].count*3;

                    const incomHistory = new IncomHistory(
                    {
                        userId: sponsor?._id?.toString(),
                        amount: wallet-walletdata,
                        type: 'direct_sponsor_comm',
                        status: 0,
                        description: 'Direct Reward 3x complete: $ ' + (wallet-walletdata),
                    });
                    incomHistory.save().then(() => {
                        
                    }).catch((error) => {
                        config.response(500, 'Internal Server Error!', {}, res);
                    });
                    directamount=walletdata-sponsor.wallet;
                    wallet=walletdata;
                    present=directamount;
                    directbonus=sponsor.directWallet + directamount;
                    internalWallet=sponsor.internalWallet + directamount;
               }
               else
               {
                    walletdata=check3XFun[0].count*3;
                    directamount=walletdata-sponsor.wallet;
                    directbonus=sponsor.directWallet + directamount;
                    internalWallet=sponsor.internalWallet + directamount;
                    wallet=sponsor.wallet+directamount;
                    lefsdata=present-directamount;
                    present=directamount;
                    const incomHistory = new IncomHistory(
                    {
                        userId: sponsor?._id?.toString(),
                        amount: lefsdata,
                        type: 'binary_comm',
                        status: 0,
                        description: 'Matching Reward 3x complete: $ ' + lefsdata,
                    });
                    incomHistory.save().then(() => {
                        
                    }).catch((error) => {
                        config.response(500, 'Internal Server Error!', {}, res);
                    });
               }
         }

         //endcondition

        const filter = { _id: sponsor._id };
        const update = { directWallet: directbonus, wallet: wallet,internalWallet: internalWallet, "gridxWallet": gridxwallet, "babyDogeWallet": babydogeWallet, "shibaWallet": shibawallet };
        const doc = await Users.findOneAndUpdate(filter, update, {
            returnOriginal: false
        }).exec((err, res) => {
           
        });
    }
    const incomHistory = new IncomHistory(
        {
            userId: sponsor?._id?.toString(),
            amount: present,
            type: 'direct_sponsor_comm',
            status: sponsor.activ_member,
            description: 'Direct Reward : $ ' + present,
        });
    incomHistory.save().then(() => {
    }).catch((error) => {
        config.response(500, 'Internal Server Error!', {}, res);
    });
}

config.binaryPVCount = async (user_id, pv) => {
    Users.find({ username: user_id, }, async (err, parent1) => {
        if (err) {
            reject(err);
            config.response(500, 'Internal Server Error!', {});
        }
        else if (parent1 == undefined) {
            reject('Internal Server Error!');
            config.response(500, 'Internal Server Error!', {});
        }
        else {

            if (parent1.length > 0) {
                var getuser = await Users.findOne({ username: user_id });
                const parent = getuser.parentId;
                const sponsorChild = await Users.find({ _id: ObjectId(parent) });

                if (sponsorChild.length > 0) {
                    const getParent = await Users.findOne({ _id: ObjectId(parent) });
                    const getChild_counter = await ChildCounter.findOne({ 'uid': parent });
                    if (getuser.position == 'L') {
                        const uleftcount = getChild_counter.left_pv + Number(pv);
                        const total_leftcount = getChild_counter.total_left_pv + Number(pv);
                        const filter = { uid: getParent._id.toString() };
                        const update = { left_pv: uleftcount, total_left_pv: total_leftcount };
                        const doc = await ChildCounter.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        }).exec((err, res) => {
                            const dailybusiness = new DailyBusiness(
                            {
                                uid: getParent._id.toString(),
                                business: pv,
                                position: 'L',
                                status: getParent.activ_member
                            });
                            dailybusiness.save().then(() => {
                               
                            }).catch((error) => {
                                config.response(500, 'Internal Server Error!', {}, res);
                            });
                        });
                    }
                    if (getuser.position == 'R') {
                        const urightcount = getChild_counter.right_pv + Number(pv);
                        const total_rightcount = getChild_counter.total_right_pv + Number(pv);
                        const filter = { uid: getParent._id.toString() };
                        const update = { right_pv: urightcount, total_right_pv: total_rightcount };
                        const doc = await ChildCounter.findOneAndUpdate(filter, update, {
                            returnOriginal: false
                        }).exec((err, res) => {
                            const dailybusiness = new DailyBusiness(
                            {
                                uid: getParent._id.toString(),
                                business: pv,
                                position: 'R',
                                status: getParent.activ_member
                            });
                            dailybusiness.save().then(() => {
                                
                            }).catch((error) => {
                                config.response(500, 'Internal Server Error!', {}, res);
                            });
                        });
                    }
                    config.binaryPVCount(getParent.username, pv);
                }
            }

        }
    })
    
}

config.guid = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4();
}

config.userActiveOrDeactive = async (username, status) => {
    const filter = { username: username };
    const update = { activ_member: status };
    const doc = await Users.findOneAndUpdate(filter, update, {
        returnOriginal: false
    }).exec((err, res) => {

    });
}

config.getUserBinary = async (value) => {
    let left_pv = value.left_pv;
    let right_pv = value.right_pv;
    var min_pv;
    if (left_pv > right_pv) {
        min_pv = right_pv;
    };
    if (right_pv > left_pv) {
        min_pv = left_pv;
    };
    if (right_pv == left_pv) {
        min_pv = left_pv;
    };
    let uid = value.uid;
    var left_pv_up = value.left_pv - min_pv;
    var right_pv_up = value.right_pv - min_pv;
    var b_comm = min_pv * 10 / 100;

    var user = await Users.findOne({ _id: ObjectId(uid) });
    if (user.activ_member) {
        let totalbinary = 0;
        let wallet = 0;
        let internalWallet = 0;
        var investamount = await BuyToken.findOne({
            userId: uid
        }).sort({ created_at: -1 });
        if (investamount) {


            const totaldata = await IncomHistory.aggregate([
                {
                    $match: {
                        userId: uid, type: "binary_comm", status: 1, created_at: {
                            $gte: new Date(new Date().setHours(00, 00, 00)),
                            $lt: new Date(new Date().setHours(23, 59, 59))
                        }
                    }
                },
                {
                    $group: {
                        _id: "$id",
                        count: {
                            $sum: "$amount"
                        }
                    }
                },

            ]);
            let binarydata = 0;

            if (totaldata == undefined || totaldata == null || totaldata == '', totaldata.length == 0) {
                binarydata = 0;
            }
            else {
                binarydata = totaldata[0].count;
            }
            if (investamount.usdamount >= (binarydata + b_comm)) {
                internalWallet = user.internalWallet + b_comm;
                totalbinary = user.binaryWallet + b_comm;
                wallet = user.wallet + b_comm;
                b_comm = b_comm;
            }
            else {
                dataamount = (binarydata + b_comm) - investamount.usdamount;
                b_commdata = investamount.usdamount - binarydata;
                b_commdata = (b_commdata <= b_comm) ? b_commdata : (b_commdata - b_comm);
                internalWallet = user.internalWallet + b_commdata;
                totalbinary = user.binaryWallet + b_commdata;
                wallet = user.wallet + b_commdata;
                if (b_commdata) {
                    b_comm = b_commdata;
                    const incomHistory = new IncomHistory(
                        {
                            userId: user?._id?.toString(),
                            amount: dataamount,
                            type: 'binary_comm',
                            status: 0,
                            description: 'Matching Reward: $ ' + dataamount,
                        });
                    incomHistory.save().then(() => {

                    }).catch((error) => {
                        config.response(500, 'Internal Server Error!', {}, res);
                    });
                }
                else {
                    user.activ_member = 0;
                }


            }
            let check3XFun = await config.check3XFun(uid);
            let check3XFunfinal = await config.check3XFunFinal(uid, check3XFun)
            if (check3XFunfinal[1] == false) {
                const filter = { _id: user._id };
                const update = { activ_member: 0 };

                const doc = await Users.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                }).exec((err, res) => {

                });

                wallet = user.wallet + 0;
                totalbinary = user.binaryWallet + 0;
                internalWallet = user.internalWallet + 0;
                user.activ_member = 0;
            }
            else {
                if (check3XFun[0].count * 3 < wallet) {
                    walletdata = check3XFun[0].count * 3;

                    const incomHistory = new IncomHistory(
                        {
                            userId: user?._id?.toString(),
                            amount: wallet - walletdata,
                            type: 'binary_comm',
                            status: 0,
                            description: 'Matching Reward 3x complete: $ ' + (wallet - walletdata),
                        });
                    incomHistory.save().then(() => {

                    }).catch((error) => {
                        config.response(500, 'Internal Server Error!', {}, res);
                    });
                    binaryamount = walletdata - user.wallet;
                    wallet = walletdata;
                    b_comm = binaryamount;
                    totalbinary = user.binaryWallet + binaryamount;
                    internalWallet = user.internalWallet + binaryamount;
                }
            }
            const filter = { _id: user._id };
            const update = { binaryWallet: totalbinary, wallet: wallet, internalWallet: internalWallet };

            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {

            });
        }
    }
    const incomHistory = new IncomHistory(
        {
            userId: user?._id?.toString(),
            amount: b_comm,
            type: 'binary_comm',
            status: user.activ_member,
            description: 'Matching Reward : $ ' + b_comm,
        });
    incomHistory.save().then(() => {
        ChildCounter.updateOne({ uid: uid }, { left_pv: left_pv_up, right_pv: right_pv_up }, (err, result) => {
            if (err) {

            }
        });
    }).catch((error) => {
        config.response(500, 'Internal Server Error!', {}, res);
    });


}

config.binaryCommissionFun = async (req, res) => {
    ChildCounter.find({ left_pv: { $gt: 0 }, right_pv: { $gt: 0 } }, async (err, childcounter) => {
        if (err) {
            config.response(500, 'Internal Server Error!', {}, res);
        }
        else if (childcounter == undefined) {
            config.response(500, 'Internal Server Error!', {}, res);
        }
        else {
            if (childcounter.length > 0) {
                childcounter.map(config.getUserBinary);
            }
        }
    })
}

config.getLiveAmount = async (req, res) => {
    const url = "https://api.polobix.com:3007/api/pancake/get_price_pair_usdt?takerAddress=0x7ffb5a90cdbd2ae2a65d5bfe259ac936cc302be2&makerAddress=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&amount=1&symbol=BNB";
    const response = await axios.get(url);
    if (response.data.success) {
        config.response(200, 'success!', { _id: "0", rate: response.data.result.message }, res);
    }
    else {
        config.response(500, 'Api Error!', {}, res);
    }
}

let childs = [];
config.recLevelChild = async (userId, req) => {
    const childsdata = await Users.find({ sponsor: userId });
    if (childsdata.length === 0) {

        return req.childId = childs;
    } else {

        childs.push(childsdata);
        //console.log(childs);
        const userId = childsdata[0].id;
        await config.recLevelChild(userId, req);
    }
}

config.totalTeamMemberID = async (user_id) => {
    let directMemberFirst = await Users.find({ parentId: user_id });
    var directMember = [directMemberFirst];
    var idsInArr1 = directMemberFirst.map((d)=>{
        return d._id; 
    });
    const idsInArr = await config.getIdsInArrayFormat(directMemberFirst);
    if(directMemberFirst.length > 0){
        await config.getTotalTeamMember(idsInArr ,directMember);
        await directMember.map((d)=>{
            d.map((inner)=>{
                idsInArr1.push(inner._id);
            });
        });
        return idsInArr1;
    }else{
        return idsInArr1;
    }
}

config.member1 = async (req, directMember, x) => {
    let ids = idsInArray1(req, directMember);
    let member = await Users.find({ parentId: { $in: ids } });
    if (member.length > 0) {
        x = x + member.length;
        await config.member1(req, member, x);
    }
    return x;
}
var memberIds = [];
function idsInArray1(req, directMember) {

    let ids = [];
    directMember.forEach((member) => {
        ids.push(member._id);
        memberIds.push(member);
    });
    req.childId = memberIds;
    return ids;
}

config.totalTeamActiveMemberID = async (req, user_id) => {
    const childdatas = await config.totalTeamMemberID(user_id);
    const activeusers = await Users.find({ _id: { $in: childdatas }, "activ_member": 1 });
    return activeusers;
}

config.totalTeamActiveMemberPosition = async (req, user_id, position) => {
    const childdatas = await config.totalTeamMemberID(user_id);
    const activeusers = await Users.find({ _id: { $in: childdatas }, "activ_member": 1, position: position });
    return activeusers;
}

config.dailyBusinesses = async (user_id, position) => {
    return DailyBusiness.aggregate([
        // Match documents created today
        {
            $match: {
                uid: user_id,
                position: position,
                created_at: {
                    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    $lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        },
        // Group documents by user id and sum the value field
        {
            $group: {
                _id: "$id",
                totalValue: { $sum: "$business" }
            }
        }
    ])
}

config.sponsorBusinesses = async (user_id, req) => {

    const spnsor = await config.recLevelChild(user_id, req);
    const childIdData = req.childId;
    
    if (childIdData.length - 1 == 0) {
        var child2data = childIdData.flat(childIdData.length);
    }
    else {
        var child2data = childIdData.flat(childIdData.length - 1);
    }
    const datas = child2data.map(getSponsorId);
    return BuyToken.aggregate([
        { $match: { userId: { $in: datas } } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        },

    ])
}

config.check3XFun = (id) => {

    return BuyToken.aggregate([
        { $match: { userId: id } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        },
    ])
}

config.check3XFunFinal = async (id, orders) => {
    if (orders == undefined || orders == null || orders == '') {
        return [0, false];
    }
    else {
        var amount = orders[0].count;
        var getuser = await Users.findOne({
            _id: ObjectId(id)
        });
        const totalcomm = getuser.wallet + getuser.withdrawalAmount;
        if (amount > 0) {
            if ((amount * 3) >= totalcomm) {
                return [totalcomm, true];
            }
            else {
                return [amount * 3, false];
            }
        }
        else {

            return [totalcomm, true];
        }
    }
}

const getSponsorId = (data) => {
    //dataadd.push(data._id.toString());
    return data._id.toString();
}

config.dailyBonusCrone = async (amount, uid, transin, activ_member) => {
    const user = await Users.findOne({ id: uid });
    var activemember = 0
    const userdaily = await Users.findOne({ id: uid, activ_member: '1' });
    if (user.renewal_status == 1) {
        daily_bonusroiWallet = amount * 0.3 / 100;
        if (userdaily) {
            roiWallet = userdaily.roiWallet + amount * 0.3 / 100;
            wallet = userdaily.wallet + amount * 0.3 / 100;
            const filter = { uid: userdaily._id.toString() };
            const update = { wallet: wallet, roiWallet: roiWallet };
            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {

            });
            activemember = 1;
        }
        else {
            activemember = 0;
        }
    }
    else {
        daily_bonusroiWallet = amount * 0.3 / 100;
        if (userdaily) {
            roiWallet = userdaily.roiWallet + amount * 0.3 / 100;
            wallet = userdaily.wallet + amount * 0.3 / 100;
            const filter = { uid: userdaily._id.toString() };
            const update = { wallet: wallet, roiWallet: roiWallet };
            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {

            });
            activemember = 1;
        }
        else {
            activemember = 0;
        }
    }
    const incomHistory = new IncomHistory(
        {
            userId: user?._id?.toString(),
            amount: daily_bonusroiWallet,
            type: 'roi',
            category: 'credit',
            status: activemember,
            description: 'Roi Comm : $ ' + daily_bonusroiWallet,
        });
    incomHistory.save().then(async () => {
    })
    const dailybonus = new DailyBonus(
        {
            userId: uid,
            transId: transin,
            amount: daily_bonusroiWallet,
            status: activ_member,
        });
    dailybonus.save().then(() => {
    }).catch((error) => {
        config.response(500, 'Internal Server Error!', {}, res);
    });

}

config.selfBusiness = async (userid) => {
    const selfbusiness = await  BuyToken.aggregate([
                { $match: { userId: userid } },
                {
                    $group: {
                        _id: "$id",
                        count: {
                            $sum: "$usdamount"
                        }
                    }
                }]);
    return (selfbusiness.length > 0 ? selfbusiness[0].count : 0);
}

config.directBusiness = async (userid) => {
    const users = await Users.find({ sponsor: userid }, '_id');
    const newArr = users.map((data) => data._id.toString());
    directBusiness = await  BuyToken.aggregate([
        { $match: { userId: { $in: newArr } } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        }
    ]);
    return (directBusiness.length > 0 ? directBusiness[0].count : 0);
}

var totalActiveTeam = 0;
config.activeMemberPosition = async (user_id, position) => {
    const activeusers = await Users.find({ parentId :user_id , position: position });
    totalActiveTeam = await Users.find({ parentId :user_id ,activ_member:1, position: position }).count();
    if(activeusers > 0){
        const idsInArr = await config.getIdsInArrayFormat(activeusers);
        await getTotalActiveTeamMember(idsInArr ,totalActiveTeam);
    }
    return totalActiveTeam;
}

config.getTotalActiveTeamMember = async (idsInArr ,totalActiveTeam) => {
    const activeusers = await Users.find({ parentId :{$in:idsInArr} , position: position });
    totalActiveTeam += await Users.find({ parentId :{$in:idsInArr} ,activ_member:1, position: position }).count();
    if(activeusers > 0){
        const idsInArr = await config.getIdsInArrayFormat(activeusers);
        await getTotalActiveTeamMember(idsInArr ,totalActiveTeam);
    }else{
        return totalActiveTeam;
    }
}

config.getTotalTeamMember = async (idsInArr ,levelUsers) => {
    const activeusers = await Users.find({ parentId :{$in:idsInArr} }).select("_id name username status created_at");
    if(activeusers.length > 0){
        const idsInArr = await config.getIdsInArrayFormat(activeusers);
        levelUsers.push(activeusers);
        await config.getTotalTeamMember(idsInArr ,levelUsers);
    }else{
        return levelUsers;
    }
}

config.getIdsInArrayFormat = async (members) => {
    var activeData = [];
    await members.map((m)=>{
        activeData.push(m._id.toString());
    });
    return activeData;
}

config.getLiveRateAmount = async () =>{
    const url = "https://api.polobix.com:3007/api/pancake/get_price_pair_usdt?takerAddress=0x7ffb5a90cdbd2ae2a65d5bfe259ac936cc302be2&makerAddress=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&amount=1&symbol=BNB";
    const response = await axios.get(url);
    return response;
}

config.directSponserBusiness = async (query ) =>{
    const users = await Users.find({ ...query }, '_id');

    const newArr = users.map((data) => data._id.toString());
    const buyToken = await BuyToken.aggregate([
        { $match: { userId: { $in: newArr } } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        }
    ])
    return (buyToken.length > 0) ? buyToken[0]?.count : 0;
}

config.directSponsorCommission = async (user_id, amount) => {

    const user = await Users.findOne({ username: user_id });
    let directbonus = user.directbonus;
    const sponsorid = user.sponsor;
    if (user.renewal_status == 1) {
        present = amount * 5 / 100;
    }
    else {
        present = amount * 5 / 100;
    }

    let sponsor = await Users.findOne({ _id: ObjectId(sponsorid) });
    if (sponsor.activ_member) {
        const babydogegwalletamt = 10000000;
        const gridxwalletamt = 1;
        const shibawalletamt = 100000;
        const totaldirectbonus = sponsor.directWallet + present;
        let directbonus = totaldirectbonus;
        let wallet = sponsor.wallet + present;
        let internalWallet = sponsor.internalWallet + present;
        const gridxwallet = sponsor.gridxWallet + gridxwalletamt;
        const babydogeWallet = sponsor.babyDogeWallet + babydogegwalletamt;
        const shibawallet = sponsor.shibaWallet + shibawalletamt;

        //3X condition

        let check3XFun = await config.check3XFun(sponsor._id.toString());
        let check3XFunfinal = await config.check3XFunFinal(sponsor._id.toString(), check3XFun);
        if (check3XFunfinal[1] == false) {
            const filter = { _id: sponsor._id };
            const update = { activ_member: 0 };

            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {

            });

            wallet = sponsor.wallet + 0;
            directbonus = sponsor.directWallet + 0;
            internalWallet = sponsor.internalWallet + 0;
            sponsor.activ_member = 0;
        }
        else {
            if (check3XFun[0].count * 3 < wallet) {
                walletdata = check3XFun[0].count * 3;

                const incomHistory = new IncomHistory(
                    {
                        userId: sponsor?._id?.toString(),
                        amount: wallet - walletdata,
                        type: 'direct_sponsor_comm',
                        status: 0,
                        description: 'Direct Reward 3x complete: $ ' + (wallet - walletdata),
                    });
                incomHistory.save().then(() => {

                }).catch((error) => {
                    config.response(500, 'Internal Server Error!', {}, res);
                });
                directamount = walletdata - sponsor.wallet;
                wallet = walletdata;
                present = directamount;
                directbonus = sponsor.directWallet + directamount;
                internalWallet = sponsor.internalWallet + directamount;
            }

        }

        //endcondition

        const filter = { _id: sponsor._id };
        const update = { directWallet: directbonus, wallet: wallet, internalWallet: internalWallet, "gridxWallet": gridxwallet, "babyDogeWallet": babydogeWallet, "shibaWallet": shibawallet };
        const doc = await Users.findOneAndUpdate(filter, update, {
            returnOriginal: false
        }).exec((err, res) => {

        });
    }
    const incomHistory = new IncomHistory(
        {
            userId: sponsor?._id?.toString(),
            amount: present,
            type: 'direct_sponsor_comm',
            status: sponsor.activ_member,
            description: 'Direct Reward : $ ' + present,
        });
    incomHistory.save().then(() => {
    }).catch((error) => {
        config.response(500, 'Internal Server Error!', {}, res);
    });
}

config.generateOTP = ()=> {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

config.sendOtp = async (mobile,message) => {
    const axios = require('axios');
    let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://sms.softfix.in/submitsms.jsp?user=EsafeS&key=d5a7374c54XX&mobile='+mobile+'&message='+message+'&senderid=SOFTFI&accusage=1&entityid=1201159965850654415&tempid=1207162088349246137',
    headers: { 
        'Cookie': 'JSESSIONID=8F9807DF5B19D868A8CCA43634D405E3'
    }
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
        console.log(error);
    });
}

config.verifyOtp = async (user,type, code, res,value, add_min = 10) => {
    const userdata = await Users.findOne({ _id: user });
    const createotptime = new Date(userdata.otp_time);
    createotptime.setMinutes(createotptime.getMinutes() + add_min);
    console.log(createotptime,new Date());
    if (createotptime > new Date()) {
        if (userdata.otp !== code) {
            config.response(200, 'Invalid OTP!', {}, res);
        }
        else {
            var resMessage = '';
            const filter = { _id: userdata._id };
            var update = {otp_time: null, otp: null}
            if(type == 'mobile'){
                resMessage = 'Mobile Has been Verified Successfully!';
                update = { ...update,sv: 1,mobile:value  };
            }else{
                resMessage = 'Emnail Has been Verified Successfully!';
                update = { ...update,ev: 1 ,email:value };
            }
            const doc = await Users.findOneAndUpdate(filter, update, {
                returnOriginal: false
            }).exec((err, res) => {
            });
            config.response(200, resMessage, {}, res);
        }
    }
    else {
        config.response(200, 'OTP Expired Please Resend', {}, res);
    }
}
config.checkUserExists = async (type,value,id) => {
    const checkUser = await Users.findOne({[type]:value,_id:{$ne:id}});
    return checkUser;
}

module.exports = config;