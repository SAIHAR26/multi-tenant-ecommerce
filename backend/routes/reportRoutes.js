const express = require("express");

const router = express.Router();

const {
  getAdminReport,
} = require("../controllers/reportController");


// GET ADMIN REPORT

router.get("/", getAdminReport);


module.exports = router;