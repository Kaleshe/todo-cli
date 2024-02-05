const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  { description: String, done: Boolean },

  { timestamps: true },
  { required: "description" }
);
const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;
