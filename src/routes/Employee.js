const express = require("express");
const router = express.Router();
const { employee, employee_Update, employee_Create, employee_Delete } = require("../controllers/Employee.js");

router.get("/", employee);
router.post("/create", employee_Create);
router.put("/update/:_id", employee_Update);
router.patch("/delete/:_id", employee_Delete);

module.exports = router;
