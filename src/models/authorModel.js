const mongoose = require("mongoose");

const authorShema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      enum: [Mr, Mrs, Miss],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Author", authorSchema);

// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }
