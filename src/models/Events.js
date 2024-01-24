const mongoose = require("mongoose");
const collectionName = "Event";

const Schema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, require: true },
    dateInfo: {
      datetime: { type: Date, default: null },
      month: { type: Number, default: null },
      year: { type: Number, default: null },
      day: { type: Number, default: null },
    },
    expense: { type: Number, default: 0 },
    estimated: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    isRemove: { type: Boolean, default: false },

  },
  {
    timestamps: true,
    _id: false,
    versionKey:false,
  }
);
module.exports = mongoose.model(collectionName, Schema);
