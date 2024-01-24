const Debts = require("../models/Debts.js");
const Event = require("../models/Events.js");
const Employee = require("../models/Employee.js");
const { v4: uuidv4 } = require("uuid");
const { getDateInfo } = require("./functions/date.js");

const debt = async (req, res) => {
  try {
    let query = {};
    const { month, employeeId } = req.body;
    if (month) query.month = month;
    if (employeeId) query.employeeId = employeeId;
    const debts = await Debts.aggregate([]).match(query).lookup({
      from: "events",
      localField: "eventId",
      foreignField: "_id",
      as: "event",
    }).unwind('event');

    if (!debts) throw new Error("DEBT_NOT_FOUND");
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json(error.toString());
  }
};

const debt_Create = async (req, res) => {
  try {
    const {
      debts = [],
      extraData: { eventId, month, year },
    } = req.body;
    if (!debts && !Array.isArray(debts) && debts.length <= 0)
      throw new Error("DEBTS_IS_NOT_VALID");
    const insert = debts.map((debt) => ({
      _id: uuidv4(),
      employeeId: debt.employeeId,
      eventId,
      month,
      year,
      unpaid: debt.total,
      total: debt.total,
    }));
    const newDebts = await Debts.insertMany(insert);
    console.log("newDebts", insert);
    if(res) res.status(200).json(newDebts);
    else return true

  } catch (error) {
    if(res) res.status(500).send("SERVER_ERROR");
    else return Promise.reject(error)
  }
};
const debt_Pay = async (req, res) => {
  try {
    const { _id, paymentAmount = 0, disponibleAmount = 0 } = req.body;
    const debt = await Debts.findOne({ _id });
    const totalPay = paymentAmount + disponibleAmount;

    if (!debt) throw new Error("DEBT_NOT_FOUND");
    if (debt.unpaid - totalPay < 0)
      throw new Error("UNPAID_CANNOT_BE_LESS_THAN_ZERO");

    let employee
    if (disponibleAmount > 0){
      employee = await Employee.findOne({ _id: debt.employeeId });
      if(employee.balance - disponibleAmount < 0)throw new Error('EMPLOYEE_HAS_NO_CREDIT_BALANCE')
      employee.balance = employee.balance - disponibleAmount
    }

    debt.payments.push({
      date: new Date(),
      value: totalPay,
    });

    if (debt.unpaid - totalPay === 0) debt.isPaid = true;
    debt.unpaid = debt.unpaid - totalPay;

    await debt.save();

    /**
     * Migrar la para event update
     * Si excede el valor del evento guardar saldo a favor
     */
    await Event.findOneAndUpdate(
      { _id: debt.eventId },
      { $inc: { paid: totalPay } }
    );
    if (employee) await employee.save();
    
    res.status(200).json(debt);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.toString());
  }
};
const debt_Update = async (req, res) => {
  try {
    const { _id, name, birthdate } = req.body;
    const birthdateInfo = getDateInfo(birthdate);
    const employeeUpdated = await Employee.findByIdAndUpdate(
      _id,
      {
        name,
        birthdateInfo,
      },
      {
        new: true,
      }
    );
    if (!employeeUpdated) {
      res.status(404).send("Employee NOT Found");
    } else {
      res.status(200).json(employeeUpdated);
    }
  } catch (error) {
    res.status(500).send("Can't update User");
  }
};

module.exports = { debt, debt_Create, debt_Update, debt_Pay };
