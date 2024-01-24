const { set, connect } = require("mongoose");
const connectDB = async () => {
  try {
    set("strictQuery", false);
    const conn = await connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
module.exports = connectDB;
