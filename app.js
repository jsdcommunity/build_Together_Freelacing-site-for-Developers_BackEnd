require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/dataBase");
const logger = require("morgan");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

// Db connection
connectDatabase();

// Import all routes
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/admin");
const developerRouter = require("./routes/developer");
const buyerRouter = require("./routes/buyer");

const ErrorResponse = require("./utils/ErrorResponse");
const errorHandler = require("./middlewares/errorHandler");

app.use("/api", indexRouter);
app.use("/api/admin", adminRouter);
app.use("/api/developer", developerRouter);
app.use("/api/buyer", buyerRouter);

// Catching 404 requests and passing to errorHandler
app.use((req, res, next)=> {
    next(new ErrorResponse(404))
})

app.use(errorHandler);

module.exports = app;
