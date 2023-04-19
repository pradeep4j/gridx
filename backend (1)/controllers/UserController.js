const config = require("../config/config");
const Users = require("../models/Users");
const ChildCounter = require("../models/ChildCounter");
const BuyToken = require("../models/BuyToken");
const DailyBusiness = require("../models/DailyBusiness");
const IncomHistory = require("../models/IncomHistory");
const userController = {};
userController.business = function (req, res) {
    Users.findOne({ username: req.body.username }, async (err, spons) => {
        if (err) {
            config.response(500, 'Internal Server Error!', {}, res);
        }
        else if (spons == undefined) {
            config.response(500, 'Invalid User!', {}, res);
        } else {
            business = await ChildCounter.findOne({ "uid": spons._id.toString() })
            //config.response(500, 'success!', business, res);
        }
    })
}
userController.checkUser = (req, res) => {
    Users.findOne({ username: req.body.username }, async (err, spons) => {
        if (err) {
            config.response(500, 'Internal Server Error!', {}, res);
        }
        else if (spons == undefined) {
            config.response(500, 'Invalid User!', {}, res);
        } else {
            const activ_member = await BuyToken.find({ 'userId': spons._id.toString() });
            let activationStatus;
            if(activ_member.length==0)
            {
                activationStatus=0;
            }
            else
            {
                activationStatus=1;
            }
            var obj = {
                "name": spons.name,
                "username": spons.username,
                "activationStatus" : activationStatus
            }

            config.response(200, 'success!', obj, res);
        }
    })
}
userController.selfBusiness = async (req, res) => {
    return BuyToken.aggregate([
        { $match: { userId: req._id.toString() } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        }])

}
userController.directBusiness = async (req, res) => {

    const users = await Users.find({ sponsor: req._id.toString() }, '_id');

    const newArr = users.map((data) => data._id.toString());
    return BuyToken.aggregate([
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

}
userController.sponsorBusiness = function (req, res, datas) {
    BuyToken.aggregate([
        { $match: { userId: { $in: datas } } },
        {
            $group: {
                _id: "$id",
                count: {
                    $sum: "$usdamount"
                }
            }
        },

    ], async (err, orders) => {

        if (err) {
            config.response(500, 'Server Error!', {}, res);
        }
        else if (orders == undefined || orders == null || orders == '') {
            config.response(500, 'No Record Found!', {}, res);
        }
        else {
            var amount = orders[0].count;
            config.response(200, 'success!', amount, res);
        }
    });
}

userController.allTeamMember = (req, res, datas) => {
    let condition = ''
    if (req.body.position && req.body.activestatus) {
        condition = { $match: { _id: { $in: datas }, 'position': req.body.position, 'activ_member': 1 } }
    }
    else if (req.body.activestatus) {

        condition = { $match: { _id: { $in: datas }, 'activ_member': Number(req.body.activestatus) } };
    }

    else if (req.body.position) {
        condition = { $match: { _id: { $in: datas }, 'position': req.body.position } }

    }
    else {

        condition = { $match: { _id: { $in: datas } } }
    }
    Users.aggregate([

        condition,
        {
            $addFields: {
                "usersid": { $toString: "$_id" }
            }
        },
        {
            $lookup:
            {
                from: 'buytokens',
                localField: 'usersid',
                foreignField: 'userId',
                as: 'buytokens'
            },
        },

    ], async (err, allteammembers) => {
        if (err) {
            config.response(500, 'Server Error!', {}, res);
        }
        else if (allteammembers == undefined || allteammembers == null || allteammembers == '') {
            config.response(200, 'No Record Found!', {}, res);
        }
        else {
            var teams = allteammembers;
            const memberdatas = teams.map(getDataObj);
            const totalBusiness = memberdatas.reduce(memberdatasbs,0);
            const datasm = memberdatas;
            config.response(200, 'success!', datasm, res, {totalBusiness});
        }
    });
}

const getDataObj = (teams) => {
    var totalamount = teams.buytokens.map(myMap, sum = 0);
    if (totalamount.length) {
        totalamount = totalamount[totalamount.length - 1];
    }
    else {
        totalamount =
        {
            totalamount: 0,
            created_at: teams.created_at
        }
    }
    const ord = {
        _id: teams._id,
        name: teams.name,
        username: teams.username,
        position: teams.position,
        activ_member: teams.activ_member,
        "amount": totalamount
    }
    return ord;
}

let sum = 0;
const myMap = ((v) => {
    sum += v.usdamount;
    const packagetoken =
    {
        "totalamount": sum,
        "created_at": v.created_at,
    }
    return packagetoken;
});

const memberdatasbs = (total, current) => {

    let sumbusiness = total + current.amount.totalamount;
    return sumbusiness;

}


userController.dashboardApi = async (req, res) => {
    var ord = {};
    var data;
    //direct business
    var directbusinessdata = await userController.directBusiness(req, res)
    if (directbusinessdata == undefined || directbusinessdata == null || directbusinessdata == '' || directbusinessdata.length == 0) {
        ord = { ...ord, direcmemberprice: 0 }
    }
    else {
        ord = await { ...ord, direcmemberprice: directbusinessdata[0].count };
    }
    //Self business
    var selfbusinessdata = await userController.selfBusiness(req, res)
    if (selfbusinessdata == undefined || selfbusinessdata == null || selfbusinessdata == '' || selfbusinessdata.length == 0) {
        ord = { ...ord, selfbusinessprice: 0 }
    }
    else {
        ord = await { ...ord, selfbusinessprice: selfbusinessdata[0].count };
    }
    business = await ChildCounter.findOne({ "uid": req._id.toString() });
    ord = await { ...ord, allbusiness: business };
    const directtotal = await Users.find({ sponsor: req._id.toString() });
    if (directtotal == undefined || directtotal == null || directtotal == '' || directtotal.length == 0) {
        ord = { ...ord, directtotal: 0 }
    }
    else {
        ord = await { ...ord, directtotal: directtotal.length };
    }
    const directActive = await Users.find({ sponsor: req._id.toString(), activ_member: '1' });
    if (directActive == undefined || directActive == null || directActive == '' || directActive.length == 0) {
        ord = { ...ord, directactive: 0 }
    }
    else {
        ord = await { ...ord, directactive: directActive.length };
    }
    const teamtotalmember = await config.totalTeamActiveMemberID(req, req._id.toString());
    ord = await { ...ord, allActivemember: teamtotalmember.length };
    const teamtotalmemberleft = await config.totalTeamActiveMemberPosition(req, req._id.toString(), 'L');
    ord = await { ...ord, leftActivemember: teamtotalmemberleft.length };
    const teamtotalmemberright = await config.totalTeamActiveMemberPosition(req, req._id.toString(), 'R');
    ord = await { ...ord, rightActivemember: teamtotalmemberright.length };
    const lefttodayamount = await config.dailyBusinesses(req._id.toString(), 'L');
    if (lefttodayamount == undefined || lefttodayamount == null || lefttodayamount == '' || lefttodayamount.length == 0) {
        ord = { ...ord, todayleftBusiness: 0 }
    }
    else {
        ord = await { ...ord, todatleftBusiness: lefttodayamount[0].totalValue };
    }
    const righttodayamount = await config.dailyBusinesses(req._id.toString(), 'R');
    if (righttodayamount == undefined || righttodayamount == null || righttodayamount == '' || righttodayamount.length == 0) {
        ord = { ...ord, todayrightBusiness: 0 }
    }
    else {
        ord = await { ...ord, todayrightBusiness: righttodayamount[0].totalValue };
    }
    const sponsorbusinesses = await config.sponsorBusinesses(req._id.toString(), req);
    if (sponsorbusinesses == undefined || sponsorbusinesses == null || sponsorbusinesses == '' || sponsorbusinesses.length == 0) {
        ord = { ...ord, sponsorBusiness: 0 }
    }
    else {
        ord = await { ...ord, sponsorBusiness: sponsorbusinesses[0].count };
    }


    config.response(200, 'success!', ord, res);
}

userController.dailyBonusCron = async (req, res) => {
    const datetime = new Date();
    const day = datetime.toLocaleString('en-US', { weekday: 'long' });
    const transactions = await BuyToken.find({ $or: [{ commDate: null }, { commDate: { $ne: datetime.toISOString().slice(0, 10) } }] });
    const dataupdate=await transactions.map(transactiondata);
    config.response(200, 'Success!', {}, res);
}
const transactiondata = async (transaction) => {
    const datetime = new Date();
    const activ_member = await Users.findOne({ _id: transaction.userId.toString() });
    const check3x = await config.check3XFun(transaction.userId);
    const check3xfinal = await config.check3XFunFinal(transaction.userId, check3x);
    if (check3xfinal[1] == false) {
        activ_member.activ_member = 0;
        await activ_member.save();
        const userfilter = { _id: activ_member._id };
        const userdate = { activ_member: 0 };
        await BuyToken.findOneAndUpdate(userfilter, userdate, {
            returnOriginal: false
        }).exec(async (err, response) => {
        })
    }
    const uid = transaction.userId;
    let transamount;
    if (transaction.status == 0) {
        transamount = transaction.gdxamount;
    }
    else {
        transamount = transaction.usdamount;
    }

    const transin = config.guid();
    const dailyBonus = await config.dailyBonusCrone(transamount, uid, transin, activ_member.activ_member);
    const userfilter = { _id: transaction._id };
    const userdate = { commDate: new Date() };
    await BuyToken.findOneAndUpdate(userfilter, userdate, {
        returnOriginal: false
    }).exec(async (err, response) => {
        return true;
    })
    
}

userController.get3Xamount=async(req,res)=>
{
    const getamount=await config.check3XFun(req._id.toString());
    const check3xfinal = await config.check3XFunFinal(req._id.toString(), getamount);
    const activeAmount = await BuyToken.findOne({userId:req._id.toString(),status:0});

    let investprice;
    if (getamount == undefined || getamount == null || getamount == '',getamount.length == 0) {
        investprice=0;
    }
    else
    {
        investprice=getamount[0].count * 3;
    }
    const datas={"walletamount":check3xfinal[0],"finalAmount":investprice,"activetedAmount":activeAmount?.gdxamount};
    config.response(200, 'No Record Found!', datas, res);
}
userController.transactionHistoryReport=async(req,res)=>
{
    let condition = ''
    if (req.body.type) {
        condition =req.body.type

    }
    else {

        condition = { $ne: 'activate key' } 
    }
    const transactionhistory=await IncomHistory.find({userId:req._id.toString(),type: condition});
    if(transactionhistory.length==0)
    {
        config.response(200, 'No Record Found!', {}, res);
    }
    else
    {
        config.response(200, 'No Record Found!', transactionhistory, res);
    }
   
    
}

userController.getMyDownline = async(req,res,next)=>
{
    try {
        var datas = {
            mydownline:[],
            totalBusiness:0
        }
        var query = {sponsor:req._id.toString()};
        if(req.body.position){
            query = {...query,position:req.body.position}
        }
        var mydownline = await Users.aggregate([
                            {$addFields: 
                                {"_id": { $toString: "$_id" }}
                            },
                            {$lookup:
                                {
                                    from:"buytokens",
                                    localField:"_id",
                                    foreignField:"userId",
                                    as:"activationData"
                                }
                            },
                            {$match:{...query}}
                        ]);
        datas.mydownline = mydownline.map((d)=>{
            return {
                _id:d._id,
                username:d.username,
                name:d.name,
                position:d.position,
                created_at:d.created_at,
                status:d.activ_member,
                activationAmount:(d?.activationData[0]?.usdamount) ? d?.activationData[0]?.usdamount : 0,
                designation:'Associate',
            }
        });
        if(datas.mydownline.length > 0){
            datas.totalBusiness = await config.directSponserBusiness(query);
            config.response(200, 'Record Fetched Successfullly!', datas, res);
        }else{
            config.response(200, 'No Record Found!', {}, res);
        }
    } catch (error) {
        next(error);
    }
}

userController.getMemberByLevel = async(req,res,next)=>
{
    try {
        var levelUsers = [];
        var totalBusiness = 0;
        var query = {parentId: req._id.toString()};
        if(req.body.position != undefined && req.body.position != ''){
            query = {...query,position:req.body.position}
        }
        var levelUser = await Users.find({ ...query }).select("_id name username status created_at");
        if(levelUser.length > 0){
            const idsInArr = await config.getIdsInArrayFormat(levelUser);
            levelUsers.push(levelUser);
            await config.getTotalTeamMember(idsInArr,levelUsers);
            if(req?.body?.level != undefined && req?.body?.level != ''){
                var datas = [];
                if(levelUsers.length > (req?.body?.level-1)){
                    levelUsers[req?.body?.level-1].map((inner)=>{
                        if(req?.body?.status != undefined && req?.body?.status != '' && req?.body?.dateRange != undefined && req?.body?.dateRange != ""){
                            date = config.currentTimeStamp(inner.created_at);
                            startDate = config.currentTimeStamp(req?.body?.dateRange[0]);
                            endDate = config.currentTimeStamp(req?.body?.dateRange[1]);
                            if(inner.status == req?.body?.status && (new Date(date) >= new Date(startDate)) && (new Date(date) <= new Date(endDate))){
                                datas.push(inner);
                            }
                        }else if(req?.body?.status != undefined && req?.body?.status != '') {
                            if(inner.status == req?.body?.status){
                                datas.push(inner);
                            }
                        }else if(req?.body?.dateRange != undefined && req?.body?.dateRange != '') {
                            if((new Date(date) >= new Date(startDate)) && (new Date(date) <= new Date(endDate))){
                                datas.push(inner);
                            }
                        }else{
                            datas.push(inner);
                        }
                    });
                }else{
                    config.response(200, 'No Record Found!', {}, res);
                }
            }else{
                var datas =[]
                levelUsers.map((u)=>{
                    u.map((inner)=>{
                        if(req?.body?.status != undefined && req?.body?.status != '' && req?.body?.dateRange != undefined && req?.body?.dateRange != ""){
                            date = config.currentTimeStamp(inner.created_at);
                            startDate = config.currentTimeStamp(req?.body?.dateRange[0]);
                            endDate = config.currentTimeStamp(req?.body?.dateRange[1]);
                            if(inner.status == req?.body?.status && (new Date(date) >= new Date(startDate)) && (new Date(date) <= new Date(endDate))){
                                datas.push(inner);
                            }
                        }else if(req?.body?.status != undefined && req?.body?.status != '') {
                            if(inner.status == req?.body?.status){
                                datas.push(inner);
                            }
                        }else if(req?.body?.dateRange != undefined && req?.body?.dateRange != '') {
                            date = config.currentTimeStamp(inner.created_at);
                            startDate = config.currentTimeStamp(req?.body?.dateRange[0]);
                            endDate = config.currentTimeStamp(req?.body?.dateRange[1]);
                            if((new Date(date) >= new Date(startDate)) && (new Date(date) <= new Date(endDate))){
                                datas.push(inner);
                            }
                        }else{
                            datas.push(inner);
                        }
                    });
                });
            }
            var finalData = [];
            for(u in datas) {
                data = datas[u]._doc;
                const business = await config.selfBusiness(data._id.toString());
                totalBusiness +=business;
                finalData.push({...data,business:business.toFixed(2)});
            }
            if(finalData.length > 0){
                config.response(200, 'Record Fetched Successfullly!', {levelData:finalData,totalbusiness:totalBusiness.toFixed(2)}, res);
            }else{
                config.response(200, 'No Record Found!', {}, res);
            }
        }else{
            config.response(200, 'No Record Found!', {}, res);
        }
    } catch (error) {
        next(error);
    }
}


module.exports = userController; 
