module.exports = (err, req, res, next)=> {
    let {statusCode = 500, message = "Internal Server Error"} = err;

    console.log(err);

    if (statusCode == 500) message = "Internal Server Error";
    if (statusCode == 404 && message == "Internal Server Error") message = "Not found";
    if (statusCode = 401 && message == "Internal Server Error") message = "Unauthorized";

    // sending error response
    res.status(statusCode).json({
        success: false,
        message
    });
}