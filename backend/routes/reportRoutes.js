const express = require("express");

<<<<<<< HEAD
const router = express.Router();

const {
  getAdminReport,
} = require("../controllers/reportController");


// GET ADMIN REPORT

router.get("/", getAdminReport);


module.exports = router;
=======
const { getAdminReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/", getAdminReport);

module.exports = router;
>>>>>>> 0e163d3577a0ac26133f4da7d6b7b7489a0452c8
