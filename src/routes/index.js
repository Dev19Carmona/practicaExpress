const express = require("express");
const router = express.Router();
const employeeRouter = require("./Employee.js");
const debtsRouter = require("./Debts.js");
const eventsRouter = require("./Events.js");
const cashFundRouter = require("./CashFund.js");

router.use("/employee", employeeRouter);
router.use("/debts", debtsRouter);
router.use("/events", eventsRouter);
router.use("/cashFund", cashFundRouter);

module.exports = router;
