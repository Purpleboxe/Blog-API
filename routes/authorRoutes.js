const express = require("express");
const passport = require("passport");
const { checkRole, checkOwnership } = require("../utils/auth")
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const authorRouter = express.Router();

authorRouter.use(passport.authenticate("jwt", { session: false }));
authorRouter.use(checkRole("author"));

authorRouter.post("/posts/create-post", async (req, res, next) => {
    try {
        const {title, content} = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required!" });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.id
            }
        });

        res.status(201).json({ message: "Post created successfully!", post })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

authorRouter.put("/posts/:postId/update", checkOwnership("postId", "post"), async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const updatedPost = await prisma.post.update({
            where: { id: req.resource.id },
            data: { title, content }
        });

        res.status(200).json({ message: "Post updated successfully!", updatedPost })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

authorRouter.delete("/posts/:postId/delete", checkOwnership("postId", "post"), async (req, res, next) => {
    try {
        await prisma.post.delete({ where: { id: req.resource.id } });

        res.status(200).json({ message: "Post deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = authorRouter;