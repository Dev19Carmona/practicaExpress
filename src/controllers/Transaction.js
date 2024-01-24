const Transaction = require("../models/Transaction");
const { cashFund_Update } = require("./CashFund");
const { v4: uuidv4 } = require("uuid");

const transaction_Create = async (req, res) => {
  try {
    const {description, dateInfo, amount, type, cashFundId} = req.body;
    const instertTransaction = {
      _id:uuidv4(),
      description,
      dateInfo,
      amount,
      type
    } 
    await new Transaction(instertTransaction).save()
    req.body = { _id: cashFundId, balance:type === 'in' ? amount : -amount };
    await cashFund_Update(req,res)
  } catch (e) {
    console.log(e);
    return Promise.reject(e)
  }
};

module.exports = { transaction_Create };
