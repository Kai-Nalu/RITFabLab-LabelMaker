const express = require('express');
const app = express();
const port = 2194;

require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l).magenta :label().green' 
});

app.get('/', (req, res) => {
  res.send('Landing page for RITFabLab-LabelMaker app!');
  console.debug(`Test connection from ${req.socket.remoteAddress}`);
});

const print_redmine = require("./print_redmine");
app.get('/print-redmine', (req, res) => {
  res.json(JSON.parse(req.query.json));
  console.log(`Printing ticket`);
  print_redmine.print_redmine(JSON.parse(req.query.json)).then(function(){
    console.log(`Print successful`);
  });
});

//DEPRECIATE
const print_jira = require("./jira/print_jira");
app.get('/print-jira', (req, res) => {
  res.send(req.query.key);
  console.log(`Printing ticket`);
  print_jira.print_jira(req.query.key).then(function(){
    console.log(`Print successful`);
  });
});

app.listen(port, () => {
  console.info(`RITFabLab-LabelMaker app listening on port ${port}`);
});