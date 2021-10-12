module.exports = {
    sayHi: (req, res, next)=> {
        res.status(200).json({
            success: true,
            message: "Let's Build Together"
        })
    },
}
