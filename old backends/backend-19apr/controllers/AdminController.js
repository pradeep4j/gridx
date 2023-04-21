const config = require("../config/config");
const Users = require("../models/Users");
const BuyToken = require("../models/BuyToken");
const PinSystem = require("../models/PinSystem");
const adminController = {};

adminController.PinSystem = async (req, res) => {
    const transaction_id = config.guid();
    const userexist = await Users.findOne({ username: req.body.username });
    if(userexist!=null)
    {
        let usdamount;
        let gdxamount;
        let liveRate =await config.getLiveRateAmount();
        if (req.body.wallettype == 'gdx') {
            usdamount = ((req.body.gdxamount) * (liveRate.data.result.message));
            gdxamount=req.body.gdxamount;
        }
        else 
        {
            usdamount = req.body.gdxamount;
            gdxamount=((req.body.gdxamount) / (liveRate.data.result.message));
        }
            const buytokendata = await BuyToken.find({ userId: userexist._id.toString() });
            if (buytokendata.length==0) {
                const buytoken = new BuyToken({
                    transactionId: transaction_id,
                    gdxamount:gdxamount,
                    userId: userexist._id.toString(),
                    usdamount: usdamount,
                    tokenType:req.body.wallettype,
                    "status": 1,
                    "pintype":req.body.pintype,
                    createdBy: '641c45a3ece066ff0aeb01b3',
                });
                buytoken.save().then(async() => {
                    var data = { ...buytoken._doc };
                    const userfilter = { _id: userexist._id };
                    const userdate = { activ_member: 1};
                    const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                            returnOriginal: false
                        }).exec(async(err, response) => {
                    })
                    const pinsystem = new PinSystem({
                        transactionId: transaction_id,
                        gdxamount:gdxamount,
                        userId: userexist._id.toString(),
                        usdamount: usdamount,
                        tokenType:req.body.wallettype,
                        "pintype":req.body.pintype,
                        createdBy: '641c45a3ece066ff0aeb01b3',
                    });
                    pinsystem.save().then(() => {
                        
                    if(req.body.pintype==3)
                    {
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

            }
            else 
            {
                
                config.response(200, 'Id is Already Activated!', {}, res);
            }
        }
        else 
        {
            
            config.response(200, 'Invalid User!', {}, res);
        }
}

adminController.walletRequest = async (req, res) => 
{
    const userexist = await WalletRequest.find();
    console.log(userexist.lenght)
    if(userexist.length==0)
    {
        config.response(200, 'No Data Found!', {}, res);
    }
    else
    {
        config.response(200, 'Success!', userexist, res);   
    }
}

adminController.apprevedWalletRequest= async (req, res) => 
{
    const walletrequest = await WalletRequest.findOne({_id:req.body.id});
    if(req.body.type==1)
    {
        const userexist = await Users.findOne({ _id: ObjectId(walletrequest.userId) });
        const userfilter = { _id: userexist._id };
        const walletrequestdata=walletrequestdata+walletrequest.gdxamount;
        const userdate = { externalWallet: walletrequestdata};
        const docdata = await Users.findOneAndUpdate(userfilter, userdate, {
                returnOriginal: false
            }).exec(async(err, response) => {
                const walletfilter = { _id: walletrequest._id };
                const userdate = { status: 1,description:req.body.description};
                const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
                    returnOriginal: false
                }).exec(async(err, response) => {
                    
                })
        })
    }
    else
    {
        const walletfilter = { _id: walletrequest._id };
        const userdate = { status:2,description:req.body.description};
        const docdata = await WalletRequest.findOneAndUpdate(walletfilter, userdate, {
            returnOriginal: false
        }).exec(async(err, response) => {
            
        })

    }
    const incomHistory = new IncomHistory(
        {
            userId: walletrequest.userId,
            amount: walletrequest.gdxamount,
            type: 'wallet_request',
            category: 'debit',
            status: req.body.type,
            description: 'Wallet Request And Approved By Admin $' + walletrequest.gdxamount,
        });
    incomHistory.save().then(async () => {

    })
}

module.exports = adminController;