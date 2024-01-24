const mongoose = require("mongoose");
const collectionName = "CashFund";

const Schema = new mongoose.Schema(
  {
    _id: { type: String },
    key: { type: String, require: true },
    balance: { type: Number, default: 0 },
    initialBalance: { type: Number, default: 0 },
    isRemove: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: false,
    versionKey: false,
  }
);

module.exports = mongoose.model(collectionName, Schema);
