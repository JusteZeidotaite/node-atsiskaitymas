const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({

  id: { type: String, required: true, min: 3 },
  title: { type: String, required: true, min: 3 },
  surname: { type: String, required: true, min: 3 },
  ticket_price: { type: String, required: true, min: 8 },
  from_location: { type: String, required: true },
  to_location: { type: Array, required: true},
  to_location_photo_url: { type: String, required: false}
});

module.exports = mongoose.model("ticket", taskSchema);