const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({

  id: { type: String, required: true, min: 3 },
  name: { type: String, required: true, min: 3 },
  surname: { type: String, required: true, min: 3 },
  email: { type: String, required: true, min: 8 },
  password: { type: String, required: true, min: 6 },
  bought_tickets: { type: Array, required: false },
  money_balance: { type: String, required: false}
});

module.exports = mongoose.model("User", taskSchema);