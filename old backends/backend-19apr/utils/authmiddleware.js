import jwt from "jsonwebtoken";
import User from './models/adminpanel/users.js';

export const protectRoute = async (req, res, next) => {
    let token;
    //console.log(req.headers.authorization.split(' ')[1]);//return;
    // if the header includes a Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // get only the token string
            token = req.headers.authorization.split(' ')[1];

            //console.log(token); return;
            // decode the token to get the corresponding user's id
            const decodedToken = jwt.verify(
                token,
                process.env.JWT
            );
            // console.log(decodedToken.id); return;
            // fetch that user from db, but not get the user's password and set this fetched user to the req.user
            req.user = await User.findById(decodedToken.id).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            next(error);
            //throw new Error('Not authorised. Token failed');
        }
    }

    if (!token) {
        res.status(401);
        //throw new Error('Not authorized, no token available');
    }
}

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) next();
    else {
        res.status(401);
        //throw new Error('Not authorised admin');
    }
};


