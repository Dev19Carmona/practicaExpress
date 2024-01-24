const express = require("express");
const router = express.Router();
const { debt, debt_Create, debt_Update, debt_Pay } = require("../controllers/Debts.js");

router.get("/", debt);
router.post("/create", debt_Create);
router.put("/update", debt_Update);
router.patch("/pay", debt_Pay);

module.exports = router;
