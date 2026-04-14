const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.type)) {
            return res.status(403).json({ success: false, message: "Access denied. Insufficient permissions." });
        }
        next();
    };
};

module.exports = authorizeRole;
