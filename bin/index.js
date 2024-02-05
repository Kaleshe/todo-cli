#! /usr/bin/env node

require("dotenv").config();

const yargs = require("yargs");
const chalk = require("chalk");
const mongoose = require("mongoose");
const Todo = require("../Models/todoModel.js");

mongoose.connect(process.env.MONGODB);

yargs.usage("\nUsage: $0 [cmd] <args>").alias("h", "help");

yargs
  .option("help", {
    description: "Lists all available options",
    demandOption: false,
  })
  .help(true);

yargs.command(
  "new",
  "Add a new todo item",
  {
    description: {
      alias: "d",
      type: "string",
      demandOption: true,
      describe: "What do you need to do?",
    },
  },
  async function ({ description, d }) {
    try {
      Todo.create({ description: description || d, done: false }).then(() => {
        console.log(`${chalk.bold.yellow(description || d)} has been added.`);
      });
    } catch (err) {
      console.log(err);
    }
  }
);

yargs.command(
  "delete",
  "Remove todo",
  {
    id: {
      type: "string",
      demandOption: true,
      describe: "Todo item ID",
    },
  },
  async function ({ id }) {
    try {
      const todo = await Todo.deleteOne({ _id: id });
      if (todo.deletedCount > 0) {
        console.log(`${chalk.yellow.bold(id)} has been succesfully deleted.`);
      } else {
        console.log(
          `Sorry, but it looks like the todo with the id ${chalk.yellow.bold(
            id
          )} doesn't exist`
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
);

yargs.command("list", "List todo items", async function () {
  try {
    const todos = await Todo.find({ done: false });
    todos.map(({ description, id }) => {
      console.log(chalk.yellow.bold.bgBlack("- " + description), chalk.dim(id));
    });
  } catch (err) {
    console.log(err);
  }
});

yargs.command("completed", "List completed todo items", async function () {
  try {
    const todos = await Todo.find({ done: true });
    todos.map(({ description, id }) => {
      console.log(chalk.green.bold.bgBlack("- " + description), chalk.dim(id));
    });
  } catch (err) {
    console.log(err);
  }
});

yargs
  .command(
    "done",
    "Mark todo as complete",
    {
      id: {
        type: "string",
        demandOption: true,
        describe: "Todo item ID",
      },
    },
    async function (argv) {
      try {
        const { description, done } = await Todo.findOneAndUpdate(
          {
            _id: argv.id,
          },
          { done: true }
        );

        if (done) {
          console.log(
            `The task: ${chalk.yellow.bold(description)} has ${chalk.red.bold(
              "already been marked"
            )} as done`
          );
        } else {
          console.log(
            `The task: ${chalk.yellow.bold(description)} has ${chalk.green.bold(
              "been marked"
            )} as done`
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
  .parseAsync(process.argv.splice(2), (err, argv, output) => {
    Promise.resolve(argv).then(() => {
      mongoose.disconnect();
    });
  });
