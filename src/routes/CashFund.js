const express = require("express");
const router = express.Router();
const { cashFund, cashFund_Update, cashFund_Create, cashFund_Delete, cashFund_Spend } = require("../controllers/CashFund.js");

router.get("/", cashFund);
router.post("/create", cashFund_Create);
router.patch("/update", cashFund_Update);
router.patch("/delete/:_id", cashFund_Delete);

module.exports = router;
