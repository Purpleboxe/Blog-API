const express = require("express");
const app = express();
const createError = require("http-errors");

const passport = require("passport");
const configurePassport = require("./config/passport");

const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: "error",
        message: "Too many requests, please try again later."
    },
    header: true,
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(cors());
app.use(helmet());

app.use(passport.initialize());
configurePassport(passport);

// Routes
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const authorRoutes = require("./routes/authorRoutes.js");
const likeRoutes = require("./routes/likeRoutes.js");
app.use("/", indexRoutes);
app.use("/", likeRoutes);
app.use("/user", authRoutes);
app.use("/author", authorRoutes);

// Catch 404 errors
app.use(function (req, res, next) {
    next(createError(404));
});
  
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    
    res.json({
        message: err.message,
        error: req.app.get("env") === "development" ? err : {}, // Show full error details if in development
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Blog API Started!"));