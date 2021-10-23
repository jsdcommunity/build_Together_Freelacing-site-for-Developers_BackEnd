const express = require("express");
const router = express.Router();

const { buyerController } = require("../controllers/buyerControllers");

router.get("/", buyerController);

module.exports = router;
