const express = require("express");

const { getAdminReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/", getAdminReport);

module.exports = router;
