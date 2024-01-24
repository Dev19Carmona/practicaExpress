const Employee = require("../models/Employee.js");
const { v4: uuidv4 } = require("uuid");
const { getDateInfo } = require("./functions/date.js");

const employee = async (req, res) => {
  try {
    let query = {isRemove: false};
    const { monthBirthdate, monthDebt, name, _id } = req.query;
    if (monthBirthdate) query["birthdateInfo.month"] = monthBirthdate;
    if (name) query.name = { $regex: name, $options: "i" };
    

    let pipeline = [];
    if (monthDebt)
      pipeline = [
        {
          $match: {
            month: parseInt(monthDebt),
          },
        },
      ];
      if (_id) query._id = _id;
    const employees = Employee.aggregate([]).match(query).lookup({
      from: "debts",
      localField: "_id",
      foreignField: "employeeId",
      pipeline,
      as: "debts",
    });

    employees.addFields({ totalDebts: { $sum: "$debts.total" } });
    const response = await employees.exec();

    if (response.length < 1) throw new Error("EMPLOYEE_NOT_FOUND");
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

const employee_Create = async (req, res) => {
  try {
    const { name, lastName, birthdate } = req.body;
    const birthdateInfo = getDateInfo(birthdate);
    const insert = {
      _id: uuidv4(),
      name,
      lastName,
      birthdateInfo,
    };

    const newEmployee = await new Employee(insert).save();
    res.status(200).json(newEmployee);
  } catch (error) {
    res.status(500).send("SERVER_ERROR");
  }
};
const employee_Update = async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, lastName, birthdate, balance } = req.body;
    const birthdateInfo = getDateInfo(birthdate);
    const update = {};
    if (name) update.$set.name = name;
    if (lastName) update.$set.lastName = lastName;
    if (birthdate) update.$set.birthdateInfo = birthdateInfo;
    if (balance) update.$inc = { balance: balance };
    const employeeUpdated = await Employee.findByIdAndUpdate(_id, update, {
      new: true,
    });
    if (!employeeUpdated) {
      res.status(404).send("Employee NOT Found");
    } else {
      res.status(200).json(employeeUpdated);
    }
  } catch (error) {
    res.status(500).send("Can't update User");
  }
};
const employee_Delete = async (req, res) => {
  try {
    const { _id } = req.params;
    const employeeDeleted = await Employee.findByIdAndUpdate(_id, {
      isRemove: true,
    });
    if (!employeeDeleted) {
      throw new Error("EMPLOYEE_NOT_FOUND");
    } else {
      res.status(200).json(employeeDeleted);
    }
  } catch (error) {
    res.status(500).send(error.toString());
  }
};

module.exports = {
  employee,
  employee_Create,
  employee_Update,
  employee_Delete,
};
