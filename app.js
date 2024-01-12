const express = require('express');

require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l).magenta :label().green' 
});

const app = express();
const port = 2194;

app.listen(port, () => {
  console.info(`RITFabLab-LabelMaker app listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Landing page for RITFabLab-LabelMaker app!');
  console.debug(`Test connection from ${req.socket.remoteAddress}`);
});

app.get('/status', (req, res) => {
  res.sendStatus(200);
  console.debug(`Test connection from ${req.socket.remoteAddress}`);
});

const print_deskpro = require("./deskpro/print_deskpro");
const print_jira = require("./jira/print_jira");
const print_handler = {"deskpro": print_deskpro, "jira": print_jira};

app.get('/print', (req, res) => {
  if (req.query.key && req.query.source) {
    res.send(req.query.key);
    console.log(`Printing ticket ${req.query.key} from ${req.query.source}`);
    print_handler[req.query.source].printWithKey(req.query.key).then(function(){
      console.log(`Print successful`);
    });
  } else { console.error("Failed request: missing key or source."); }
});