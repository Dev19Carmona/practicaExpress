const mongoose = require("mongoose");
const collectionName = "Debts";

const Schema = new mongoose.Schema(
  {
    _id: { type: String },
    employeeId: { type: String },
    eventId: { type: String },
    month: { type: Number, default: null },
    year: { type: Number, default: null },
    total: { type: Number, require: true },
    unpaid: { type: Number },
    isPaid: { type: Boolean, default: false },
    payments: [
      {
        date: Date,
        value: Number,
      },
    ],
  },
  {
    timestamps: true,
    _id: false,
    versionKey: false,
  }
);

module.exports = mongoose.model(collectionName, Schema);
