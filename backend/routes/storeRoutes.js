const express = require("express");

const router = express.Router();

const {
  createStore,
  getStores,
  updateStore,
} = require("../controllers/storeController");

router.post("/", createStore);

router.get("/", getStores);

router.put("/:id", updateStore);

module.exports = router;