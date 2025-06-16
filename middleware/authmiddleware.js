const jwt = require("jsonwebtoken");
const JWT_SECRET = 'kpkp';
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(' ')[1];
    try {
        //const decoded = jwt.decode(token); // No signature check, just see what's inside
        //console.log(decoded);

        const decoded = jwt.verify(token, JWT_SECRET); // Verifies if token is valid and signed by your secret
        req.user = decoded;
        
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorized: Invalid token provided" });
    }
};
module.exports = auth;