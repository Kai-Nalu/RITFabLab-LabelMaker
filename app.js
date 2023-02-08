const express = require('express');
const app = express();
const port = 2194;

require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l).magenta :label().green' 
});

app.get('/', (req, res) => {
  res.send('Landing page for RITFabLab-LabelMaker app!');
});

const print_redmine = require("./print_redmine");
app.get('/print-redmine', (req, res) => {
  res.json(JSON.parse(req.query.json));
  console.log(`Printing ticket`);
  print_redmine.print_redmine(JSON.parse(req.query.json)).then(function(){
      console.log(`Print successful`);
  });
});

const print_jira = require("./print_jira");
app.get('/print-jira', (req, res) => {
  console.log(`Connected`);
});

app.listen(port, () => {
  console.log(`RITFabLab-LabelMaker app listening on port ${port}`);
});