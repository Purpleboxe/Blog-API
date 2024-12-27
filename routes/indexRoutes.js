const express = require("express");
const passport = require("passport");

const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
    res.json({ header: "Blog", user: req.user });
});

module.exports = indexRouter;