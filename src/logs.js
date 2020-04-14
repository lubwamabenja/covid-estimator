const fs = require('fs');
const path = require('path');

const changeTime = (start) => {
  const starttime = process.hrtime(start);
  const time = (starttime[0] * 1e9 + starttime[1]);
  return time * 1e-6;
};


const createMessage = (request, response) => {
  const { statusCode } = response;
  const { method, url } = request;

  const logT = process.hrtime();
  const logTime = changeTime(logT).toLocaleString();
  const message = `${method}\t\t${url}\t\t${statusCode}\t\t${logTime}ms`;

  const filename = path.join(__dirname, 'logs.txt');
  fs.appendFile(filename, `${message}\n`, (err) => {
    if (err) {
      throw new Error('file not created');
    }
  });
};
module.exports = createMessage;
