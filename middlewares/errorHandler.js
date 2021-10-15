module.exports = (err, req, res, next)=> {
    let {statusCode = 500, message = "Internal Server Error"} = err;

    if(statusCode == 404){
        message = "Not Found"
    }

    // if(statusCode == 401){
    //     message = "Unauthorized"
    // }

    // sending error response
    // console.error(message)
    res.status(statusCode).json({
        success: false,
        message
    })
}