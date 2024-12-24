const express = require("express");
const app = express();
const createError = require("http-errors");

const passport = require("passport");
const configurePassport = require("./config/passport");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
configurePassport(passport);

// Routes
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
app.use("/", indexRoutes);
app.use("/user", authRoutes);

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