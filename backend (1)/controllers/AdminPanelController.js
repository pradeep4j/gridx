const config = require("../config/config");
const User = require("../models/adminpanel/users");
const mongoose = require('mongoose');
const jwt  = require('jsonwebtoken');
const bcryptjs  = require('bcryptjs');
export const register = async (req, res) => {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
        return res.send("409");
    }
    try {
        var salt = bcryptjs.genSaltSync(10);
        var hash = bcryptjs.hashSync(req.body.password, salt);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hash
        }
        const newuser = new User(user);
        await newuser.save();
        res.status(201).json('newuser');

    } catch (error) {
        console.log(error)
    }

}
export const login = async (req, res) => {
    //console.log('process.env.JWT'); return;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            //next(createError(404,"User Not Found!"));
            return res.send("404");
        }
        const passwordDB = user.password;
        const matchPasswotd = await bcryptjs.compare(req.body.password, passwordDB);

        if (matchPasswotd === false) {
            return res.send("400");
        }

        //now remove Password and isAdmin from User get from query as follows   
        //const { Password, isAdmin, ...otherDetails } = User;   
        //since in output of return response.json({...otherDetails}); I am getting collectable values in _doc variable so
        const { password, ...otherDetails } = user._doc;
        //now I have to install a jwt here. first install npm install jsonwebtoken and create jwt via openssl>rand -base64 32 and put it to .env file for privacy. And now create token with sign jwt token with user id and isadmin as
        const token = jwt.sign({ id: user._id }, process.env.JWT, { expiresIn: "2d" });
        //now put this token in a cookie by installing npm install cookie-parser. After this initialize this cookie-parser in index.js as app.use() and send back a cookie in response to browser with created token
        //res.cookie('access_token',token,{expire : 36000 + Date.now(), httpOnly:true}).status(200).json({...otherDetails});
        otherDetails.access_token = token;
        res.cookie('access_token', token, { maxAge: (2 * 24 * 60 * 60 * 1000) /* cookie will expires in 2 days*/, httpOnly: true }).status(201).json({ ...otherDetails });

    } catch (error) {
        res.status(400).json({ message: error.message });
        // next(error);
    }
}
export const logout = async (request, response) => {
    try {
        response.clearCookie('access_token');
        response.status(201).json('User Logged out successfully!!');

    } catch (error) {
        response.status(404).json({ message: error.message })
    }
}