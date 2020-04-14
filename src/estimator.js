const express = require('express');
const cors = require('cors');
const Xml = require('xml2js');
const path = require('path');
const fs = require('fs');
const prototypeEstimator = require('./functions');
const createLog = require('./logs');


const App = express();

const example = {
  region: {
    name: "Africa",
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: "days",
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};


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


App.post('/api/v1/on-covid-19',(req,res) => {
  res.status(200).json(covid19ImpactEstimator(example));
  createLog(req,res);
  res.end();
});

App.post('/api/v1/on-covid-19/xml',(req,res) =>{
  const xmlBuilder = new Xml.Builder();
  res.set('Content-type','application/xml');
  res.status(200).send(xmlBuilder.buildObject(covid19ImpactEstimator(example)));
  createLog(req,res);
  res.end();

});

App.get('/api/v1/on-covid-19/logs', (req,res) => {

  const filepath = path.join(__dirname,'logs.txt');
  const logs = fs.readFileSync(filepath,'utf8');
  res.status(200).send(logs);
  createLog(req,res);
  res.end();
})

App.listen(process.env.PORT || 3000, () => {
  console.log('server running on port 3000', '');
})
// export default covid19ImpactEstimator;
