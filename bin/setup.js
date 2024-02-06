const db = require("./db.js");

db.serialize(() => {
  db.run(
    "CREATE TABLE todos( ID INTEGER primary key, DESCRIPTION VARCHAR(100), DONE INTEGER )"
  );
});

db.close();
