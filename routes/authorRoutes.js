const express = require("express");
const passport = require("passport");
const { checkRole } = require("../utils/auth")
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const authorRouter = express.Router();

authorRouter.use(passport.authenticate("jwt", { session: false }));
authorRouter.use(checkRole("author"));

authorRouter.post("/create-post", async (req, res, next) => {
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
})

module.exports = authorRouter;