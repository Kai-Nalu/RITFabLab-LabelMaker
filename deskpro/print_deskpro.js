const fetch = require("node-fetch");
const fs = require("fs");

async function deskproAPIGet(id) {
    const APIKey = fs.readFileSync('./deskpro/deskproAPIToken.txt',{
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
    return data['ticket'];
}

function processTicketData(data) {
    const id = data['id'];
    const person = data['person']['name'];
    const subject = data['subject'];
    const method = data['field1'];
    const copies = data['field51'];
    const cost = data['field184'];
    const start_date = data['date_created'];
    let id_padded = id.toString().padStart(5, '0');
    let id_formatted = `FL-${id_padded}`;
    let start_date_obj = new Date(start_date);
    let start_date_formatted = start_date_obj.toLocaleDateString('en-US', {});
    return {
        "id": id_formatted,
        "author": person,
        "subject": subject,
        "tracker": method,
        "Copies": copies,
        "Estimated Cost": cost,
        "start_date": start_date_formatted
    };
}

function printWithKey(key) {
    return new Promise (resolve => {
        const exec = require('child_process').exec;
        const generate_label_png = require("../generate_label_png");
        deskproAPIGet(key).then(function(result) {
            ticketData = processTicketData(result);
            generate_label_png.generate_label_png(ticketData).then(function(){
                exec('lp -d DYMO_LabelWriter_450 ./output/label.png');
                resolve();
            });
        });
    });
}

module.exports = { printWithKey };