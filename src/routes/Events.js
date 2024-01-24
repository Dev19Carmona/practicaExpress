const express = require("express");
const router = express.Router();
const { event, event_Update, event_Create, event_Delete, event_Spend } = require("../controllers/Events.js");

router.get("/", event);
router.post("/create", event_Create);
router.patch("/update", event_Update);
router.patch("/delete/:_id", event_Delete);
router.patch("/spend", event_Spend);

module.exports = router;
