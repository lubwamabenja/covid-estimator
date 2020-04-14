const express = require('express');
const cors = require('cors');
const Xml = require('xml2js');
const path = require('path');
const fs = require('fs');
const prototypeEstimator = require('./functions');
const createLog = require('./logs');


const App = express();


App.use(
  cors({
    credentials: true,
    origin: true
  })
);
App.options('*', cors());

const covid19ImpactEstimator = (data) => ({
  data,
  impact: prototypeEstimator({ ...data }, 10),
  severeImpact: prototypeEstimator({ ...data }, 50)
});

const result = (exampleData) => { covid19ImpactEstimator(exampleData); };

App.get('/', (req, res) => {
  res.status(200).send('welcome to the covid19ImpactEstimator');
  createLog(req, res);
  res.end();
});

App.post('/api/v1/on-covid-19', (req, res) => {
  const data = req.body;
  res.status(200).json(result(data));
  createLog(req, res);
  res.end();
});

App.post('/api/v1/on-covid-19/xml', (req, res) => {
  const xmlBuilder = new Xml.Builder();
  res.set('Content-type', 'application/xml');
  const data = req.body;
  res.status(200).send(xmlBuilder.buildObject(result(data)));
  createLog(req, res);
  res.end();
});

App.get('/api/v1/on-covid-19/logs', (req, res) => {
  const filepath = path.join(__dirname, 'logs.txt');
  const logs = fs.readFileSync(filepath, 'utf8', (err) => {
    if (err) {
      throw new Error('Faailed to read file');
    }
  });
  res.status(200).send(logs);
  createLog(req, res);
  res.end();
});

App.listen(process.env.PORT || 3000);

export default covid19ImpactEstimator;
