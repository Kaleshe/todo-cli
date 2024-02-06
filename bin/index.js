#! /usr/bin/env node

require("dotenv").config();

const yargs = require("yargs");
const chalk = require("chalk");

const db = require("./db.js");

yargs.usage("\nUsage: $0 [cmd] <args>").alias("h", "help");

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
  ({ description, d }) => {
    db.run(
      `INSERT INTO todos(description, done) VALUES(?, ?)`,
      [description || d, 0],
      (err) => {
        if (err) {
          throw err;
        }
        console.log(`${chalk.bold.yellow(description || d)} has been added.`);
      }
    );
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
  ({ id }) => {
    db.run(`DELETE FROM todos WHERE ID = ?`, id, (err) => {
      if (err) {
        throw err;
      }

      console.log(`${chalk.yellow.bold(id)} has been succesfully deleted.`);
    });
  }
);

yargs.command("list", "List todo items", () => {
  db.all(`SELECT * FROM todos WHERE DONE=0`, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      console.log("You don't have any todos, why dont you make some?");
    }

    rows.forEach((row) => {
      console.log(
        chalk.dim(row.ID),
        chalk.yellow.bold.bgBlack(row.DESCRIPTION)
      );
    });
  });
});

yargs.command("completed", "List completed todo items", () => {
  db.each(`SELECT * FROM todos WHERE done=1`, [], (err, row) => {
    if (err) {
      throw err;
    }

    console.log(chalk.dim(row.ID), chalk.green.bold.bgBlack(row.DESCRIPTION));
  });
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
    ({ id }) => {
      db.run(`UPDATE todos SET done = ? WHERE id = ?`, [true, id], (err) => {
        if (err) {
          throw err;
        }

        console.log(
          `Task ${chalk.yellow.bold(id)} has ${chalk.green.bold(
            "been marked as done"
          )}`
        );
      });
    }
  )
  .parseAsync(process.argv.splice(2), (err, argv, output) => {
    Promise.resolve(argv).then(() => {
      db.close();
    });
  });
