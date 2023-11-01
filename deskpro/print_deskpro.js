const fs = require("fs");

async function deskproAPIGet(id) {
    const APIKey = fs.readFileSync('./deskproAPIToken.txt',{
        encoding: 'utf8',
        flag: 'r'
    });
    const response = await fetch(`https://fablab.cad.rit.edu/api/tickets/${id}`, {
        method: "GET",
        headers: {
            "X-DeskPRO-API-Key": APIKey
        }
    });
    const data = await response.json();
    return data['tickets'][0];
}

function processAPIData(data) {
    const id = data['id'];
    const person = data['person']['name'];
    const subject = data['subject'];
    const method = data['field1'];
    const copies = data['field51'];
    const cost = data['field184'];
    const start_date = Date.parse(data['date_created']).toLocaleDateString('en-US', {});
    return {
        "id": id,
        "author": person,
        "subject": subject,
        "tracker": method,
        "Copies": copies,
        "Estimated Cost": cost,
        "start_date": start_date
    };
}

function printWithKey(key) {
    return new Promise (resolve => {
        const exec = require('child_process').exec;
        const generate_label_png = require("../generate_label_png");
        result = processAPIData(deskproAPIGet(key));
        generate_label_png.generate_label_png(result).then(function(){
            exec('lp -d DYMO_LabelWriter_450 ./output/label.png');
            resolve();
        });
    });
}

module.exports = { printWithKey };