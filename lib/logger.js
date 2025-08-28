'use strict';

var _ = require('lodash'),
    winston = require('winston'),
    expressWinston = require('express-winston'),
    config  = require('./config');

var transports = [
  new winston.transports.Console({
    level: config.get('log:level'),
    format: winston.format.combine(
      winston.format.json(),
      winston.format.timestamp()
    ),
    handleExceptions: true,
    handleRejections: true
  })
];

if (config.get('log:file')) {
  transports.push(
    new winston.transports.File({
      filename: config.get('log:file'),
      level: config.get('log:level'),
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp()
      ),
      handleExceptions: true,
      handleRejections: true
    })
  );
}

var logger = winston.createLogger({
  transports: transports,
  exitOnError: false
});

logger.express = {
  error: function(app) {
    app.use(expressWinston.errorLogger({
      transports: transports
    }));
  },

  access: function(app) {
    app.use(expressWinston.logger({
      transports: transports
    }));
  }
};

logger.exception = function(message, err) {
  var moreArgs = [].slice.apply(arguments).slice(2);
  if (!err || !(err instanceof Error) || !err.stack) {
    moreArgs.unshift(err);
  } else {
    moreArgs.unshift(_.extend({
      stack:   err.stack && err.stack.split('\n'),
      message: err.message
    }, err));
  }
  moreArgs.unshift(message);
  return logger.error.apply(logger, moreArgs);
};

module.exports = logger;
