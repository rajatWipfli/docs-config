const winston = require('winston');
const {MESSAGE} = require('triple-beam');

const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.cli({message: true}),
    // Create a format instance
    winston.format(info => {
      if (info.level !== 'error') {
        info[MESSAGE] = info.message.trim();
      }
      return info;
    })()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = Logger;
