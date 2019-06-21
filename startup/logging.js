require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  //-----------------------Error handleing/ Logging------------------------

  winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly2" })
  );

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(new winston.transports.Console());

  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExeptions.log" }),
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly2" })
  );

  process.on("unhandledRejection", ex => {
    throw ex;
  });
};
