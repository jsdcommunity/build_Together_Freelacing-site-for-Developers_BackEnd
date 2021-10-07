module.exports = {
    buyerController: (req, res, next)=> {
        res.status(200).json({
            success: true,
            message: "Buyer api router"
        })
    },
}