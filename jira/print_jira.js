exports.print_jira = function(args) {
    return new Promise (resolve => {
        const jiraHandler = require("./jiraHandler");
        jiraHandler.jiraHandler(args).then(function(result) {
            const exec = require('child_process').exec;
            const generate_label_png = require("../generate_label_png");
            
            generate_label_png.generate_label_png(result).then(function(){
                exec('lp -d DYMO_LabelWriter_450 ./output/label.png');
                resolve();
            });
        });
    });
};