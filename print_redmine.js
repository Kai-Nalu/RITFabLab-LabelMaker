exports.print_redmine = function(args) {
    return new Promise (resolve => {
        const exec = require('child_process').exec;
        const generate_label_png = require("./generate_label_png");
        
        generate_label_png.generate_label_png(args).then(function(){
            exec('lp -d DYMO_LabelWriter_450 ./output/label.png');
            resolve();
        });
    });
};