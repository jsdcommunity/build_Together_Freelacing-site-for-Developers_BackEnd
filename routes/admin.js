const express = require("express");
const router = express.Router();

const { adminConroller } = require("../controllers/adminControllers");

router.get("/", adminConroller);

module.exports = router;
