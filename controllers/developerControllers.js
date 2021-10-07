module.exports = {
    developerController: (req, res, next)=> {
        res.status(200).json({
            success: true,
            message: 'Developer api',
        })
    },
}