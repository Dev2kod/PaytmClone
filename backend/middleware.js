const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Unauthorized: Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded.userid) {
            return res.status(403).json({ message: "Invalid token payload" });
        }
        req.userid = decoded.userid;
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {authMiddleware};