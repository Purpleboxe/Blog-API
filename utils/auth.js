const {verifyToken} = require("./jwt");

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
  
    try {
        const user = verifyToken(token);
        req.user = user; // Attach the user info to the request
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = {authenticateToken};