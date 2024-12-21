const express = require("express");
const app = express();
const createError = require("http-errors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res, next) => {
    res.json({message: "Blog"});
})

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