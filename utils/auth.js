const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || role !== req.user.role) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    }
}

module.exports = {checkRole};