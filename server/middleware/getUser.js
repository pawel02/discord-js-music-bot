const jwt = require("jsonwebtoken")
const User = require("../models/user")


const getUser = (req, res, next) => {
    if (req.headers.authorization == null) return res.sendStatus(401);
    const token = req.headers.authorization.split(" ")[1]
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                req.user = null;
                return res.sendStatus(401)
            } else {
                let user = await User.findById(decodedToken.id);
                if(!user) return res.sendStatus(401)
                req.user = user;
                next();
            }
        });
    } else {
        return res.sendStatus(401)
    }
}

module.exports = getUser