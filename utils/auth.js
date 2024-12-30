const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || role !== req.user.role) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    }
}

const checkOwnership = (idParam, model) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[idParam];
            const resource = await prisma[model].findUnique({ where: { id: resourceId } });
    
            if (!resource) {
                return res.status(400).json({ message: `${model} not found!` });
            }
    
            if (resource.authorId !== req.user.id) {
                return res.status(403).json({ message: "Access denied" });
            }
    
            req.resource = resource;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }  
}

module.exports = {checkRole, checkOwnership};