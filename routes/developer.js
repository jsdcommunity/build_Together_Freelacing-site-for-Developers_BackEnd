const express = require("express");
const router = express.Router();

const { developerController } = require("../controllers/developerControllers");

router.get("/", developerController);

module.exports = router;
