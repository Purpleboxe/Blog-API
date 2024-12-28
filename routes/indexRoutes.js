const express = require("express");
const passport = require("passport");
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

indexRouter.post("/:postId/create-comment", passport.authenticate("jwt", { session: false }), async (req, res) => {
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
        res.status(500)
    }
})

module.exports = indexRouter;