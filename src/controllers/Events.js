const Event = require("../models/Events.js");
const { v4: uuidv4 } = require("uuid");
const { getDateInfo } = require("./functions/date.js");
const { debts_Create } = require("./Debts.js");
const { transaction_Create } = require("./Transaction.js");

const event = async (req, res) => {
  try {
    let query = {};
    const { month, year } = req.query;
    console.log(month);
    if (month && year) {
      query = {
        "dateInfo.month": month,
        "dateInfo.year": year,
      };
    } else if (month) {
      query = { "dateInfo.month": month };
    } else if (year) {
      query = { "dateInfo.year": year };
    }
    const events = await Event.find(query);
    if (events.length < 1) throw new Error("EVENT_NOT_FOUND");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const event_Create = async (req, res) => {
  try {
    const { name, date, estimated, employeeIds = [], fee } = req.body;

    const dateInfo = getDateInfo(date);
    const insert = {
      _id: uuidv4(),
      name,
      dateInfo,
      estimated,
      fee,
    };

    const newEvent = await new Event(insert).save();

    if (employeeIds.length > 0) {
      const debts = employeeIds.map((employeeId) => ({
        employeeId,
        total: fee,
      }));
      const extraData = {
        eventId: newEvent._id,
        month: dateInfo.month,
        year: dateInfo.year,
      };
      req.body = {
        debts,
        extraData,
      };
      await debts_Create(req);
    }

    res.status(200).json(newEvent);
  } catch (error) {
    res.status(500).send("SERVER_ERROR");
  }
};

const event_Update = async (req, res) => {
  try {
    const { _id, name, date, estimated } = req.body;
    let update = {};
    let dateInfo;
    if (date) {
      dateInfo = getDateInfo(date);
      update.dateInfo = dateInfo;
    }
    if (name) update.name = name;
    if (estimated) update.estimated = estimated;
    const eventUpdated = await Event.findByIdAndUpdate(_id, update, {
      new: true,
    });
    if (!eventUpdated) {
      res.status(404).send("Event NOT Found");
    } else {
      res.status(200).json(eventUpdated);
    }
  } catch (error) {
    res.status(500).send("Can't update Event");
  }
};

const event_Delete = async (req, res) => {
  try {
    const { _id } = req.params;
    const eventDeleted = await Event.findByIdAndUpdate(_id, {
      isRemove: true,
    });
    if (!eventDeleted) {
      throw new Error("Event NOT Found");
    } else {
      res.status(200).json(eventDeleted);
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const event_Spend = async (req, res) => {
  try {
    const { expense, eventId, cashFundId } = req.body;
    const event = await Event.findOne({ _id: eventId });
    const remaining = event.paid - expense;

    if (!event) throw new Error("EVENT_NOT_FOUND");
    if (remaining !== 0){
      const insertNewTransaction = {
        description: event.name,
        dateInfo: getDateInfo(new Date()),
        amount: Math.abs(remaining),
        type: remaining < 0 ? 'out' : 'in',
        cashFundId
      }
      req.body = insertNewTransaction
      return await transaction_Create(req,res)
    }
    res.status(200).json({message: 'TRANSACTION_SUCCESS'});
  } catch (error) {
    res.status(500).json({message:error})
  }
};

module.exports = { event, event_Create, event_Update, event_Delete, event_Spend };
