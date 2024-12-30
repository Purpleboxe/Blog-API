const express = require("express");
const passport = require("passport");
const { checkOwnership } = require("../utils/auth");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
    if (req.user) {
        res.json({ header: "Blog", user: req.user });
    } else {
        res.json({ header: "Blog" });
    }
});

indexRouter.get("/posts", async (req, res) => {
    try {
        const posts = await prisma.post.findMany();

        if (!posts.length) {
            res.status(200).json({ message: "No posts available!" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

indexRouter.get("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                comments: {
                    include: {
                        author: {
                            select: { username: true }
                        }
                    }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found!" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

indexRouter.post("/posts/:postId/create-comment", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Comment is required!" });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!post) {
            return res.status(400).json({ message: "Post not found! "});
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: req.user.id
            }
        });

        res.status(201).json({ message: "Comment created successfully!", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

indexRouter.put("/comments/:commentId/update", passport.authenticate("jwt", { session: false }), checkOwnership("commentId", "comment"), async (req, res, next) => {
    try {
        const { content } = req.body;

        const updatedComment = await prisma.comment.update({
            where: { id: req.resource.id },
            data: { content }
        });

        res.status(200).json({ message: "Comment updated successfully!", updatedComment })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

indexRouter.delete("/comments/:commentId/delete", passport.authenticate("jwt", { session: false }), checkOwnership("commentId", "comment"), async (req, res, next) => {
    try {
        await prisma.comment.delete({ where: { id: req.resource.id } });

        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = indexRouter;