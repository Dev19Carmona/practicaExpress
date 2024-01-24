const mongoose = require("mongoose");
const collectionName = "Transaction";

const Schema = new mongoose.Schema(
  {
    _id: { type: String },
    description: { type: String, require: true },
    dateInfo: {
      datetime: { type: Date, default: null },
      month: { type: Number, default: null },
      year: { type: Number, default: null },
      day: { type: Number, default: null },
    },
    amount: { type: Number, default: 0 },
    type: { type: String, require: true },
    isRemove: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    _id: false,
    versionKey: false,
  }
);

module.exports = mongoose.model(collectionName, Schema);
