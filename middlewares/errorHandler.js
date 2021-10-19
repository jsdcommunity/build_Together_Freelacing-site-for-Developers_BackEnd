module.exports = (err, req, res, next)=> {
    let {statusCode = 500, message = "Internal Server Error"} = err;

    console.log(err)

    if(statusCode == 500){
        message = "Internal Server Error"
    }

    // sending error response
    res.status(statusCode).json({
        success: false,
        message
    })
}