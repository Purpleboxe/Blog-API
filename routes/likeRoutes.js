const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const likesRouter = express.Router();

likesRouter.use(passport.authenticate("jwt", { session: false }));

likesRouter.post("/posts/:postId/like", async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        const like = await prisma.like.create({
            data: {
                userId,
                postId
            }
        });

        res.status(201).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

likesRouter.delete("/posts/:postId/like", async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        await prisma.like.deleteMany({
            where: {
                userId,
                postId
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

likesRouter.post("/comments/:commentId/like", async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;

        const like = await prisma.like.create({
            data: {
                userId,
                commentId
            }
        });

        res.status(201).json(like);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

likesRouter.delete("/comments/:commentId/like", async (req, res, next) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;

        await prisma.like.deleteMany({
            where: {
                userId,
                commentId
            }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = likesRouter;