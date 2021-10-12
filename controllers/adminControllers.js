module.exports = {
    adminConroller: (req, res, next) => {
        res.status(200).json({
            success: true,
            message: "Admin api router",
        });
    },
};
