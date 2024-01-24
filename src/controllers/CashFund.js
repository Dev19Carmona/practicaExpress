const CashFund = require("../models/CashFund.js");
const { v4: uuidv4 } = require("uuid");

const cashFund = async (req, res) => {
  try {
    let query = {};
    const { _id, key } = req.query;
    if(_id)query._id = _id;
    if(key)query.key = key;
    const cashFunds = await CashFund.find(query);
    if (cashFunds.length < 1) throw new Error("CASHFUND_NOT_FOUND");
    res.status(200).json(cashFunds);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const cashFund_Create = async (req, res) => {
  try {
    const { key, balance } = req.body;
    const insert = {
      _id: uuidv4(),
      key,
      balance,
      initialBalance:balance,
    };
    const newCashFund = await new CashFund(insert).save();

    res.status(200).json(newCashFund);
  } catch (error) {
    res.status(500).send("SERVER_ERROR");
  }
};
const cashFund_Update = async (req, res) => {
  try {
    const { key, balance, _id } = req.body;
    let update = { $set: {}, $inc: {} };
    
    if (key) update.$set.key = key;
    if (balance) update.$inc.balance = balance;
    console.log(update);
    const cashFundUpdated = await CashFund.findByIdAndUpdate(_id, update, {
      new: true,
    });
    if (!cashFundUpdated) {
      return res.status(404).send("cashFund NOT Found");
    } else {
      return res.status(200).json(cashFundUpdated);
    }
  } catch (error) {
    res.status(500).send("Can't update cashFund");
  }
};
const cashFund_Delete = async (req, res) => {
  try {
    const { _id } = req.params;
    const cashFundDeleted = await CashFund.findByIdAndUpdate(_id, {
      isRemove: true,
    });
    if (!cashFundDeleted) {
      throw new Error("cashFund NOT Found");
    } else {
      res.status(200).json(cashFundDeleted);
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};
module.exports = { cashFund, cashFund_Create, cashFund_Update, cashFund_Delete };
