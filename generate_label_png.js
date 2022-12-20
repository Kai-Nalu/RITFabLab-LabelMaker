exports.generate_label_png = function(args) {
    return new Promise (resolve => {
        const fs = require('fs');
        const { registerFont, createCanvas } = require('canvas');
        
        let raw_label_template = fs.readFileSync('./config/label_template.json');
        let json_label_template = JSON.parse(raw_label_template);
        
        registerFont('./fonts/verdana.ttf', {family: 'VerdanaMS', weight: 'normal'});
        registerFont('./fonts/verdana-bold.ttf', {family: 'VerdanaMS', weight: 'bold'});
        font_family = 'VerdanaMS';
        
        //let canvas = createCanvas(794, 247);
        let canvas = createCanvas(1191, 371);
        let context = canvas.getContext('2d');
        
        let tabler = [];
        let tabler_empties = 0;
        
        let multi_line_content = [];
        json_label_template.forEach(function(obj) {
            if (args[obj.name]) {
                let data = args[obj.name];
                switch (obj.text_type) {
                    case "title":
                        tabler.push({content:[{label: obj.label, data: data}], height:2});
                        tabler.push({content:"empty"});
                        tabler_empties += 1;
                        break;
                    case "multi_line":
                        multi_line_content.push({label: obj.label, data: data});
                        if (obj.line_break) {
                            tabler.push({content:multi_line_content, height:1});
                            multi_line_content = [];
                        }
                        break;
                }
            }
        });
        
        const y_margin = canvas.width*0.0125; /*was 10*/
        const x_margin = canvas.width*0.025; /*was 20*/
        const y_gap = canvas.width*0.0125; /*was 10*/
        const x_gap = canvas.width*0.025; /*was 20*/
        
        let base_font_size = (canvas.height-(y_margin*2)-(y_gap*(tabler.length-(1+tabler_empties))))/tabler.length;
        let stepper = 0;
        
        stepper += y_margin;
        for (let row in tabler) {
            if (tabler[row].content != "empty") {
                let font_size = base_font_size*tabler[row].height;
                context.font = `normal ${font_size}px ${font_family}`;
                context.textBaseline = 'middle';
                context.textAlign = 'left';
                context.fillStyle = '#000';
                
                while (((fieldFullTextLength(tabler[row].content, font_size)) + (x_gap*(tabler[row].content.length - 1)) + (x_margin*2)) > canvas.width) {
                    font_size -= 0.5;
                }
                
                if (tabler[row].content.length > 1) {
                    let spacer = (canvas.width - fieldFullTextLength(tabler[row].content, font_size) - (x_margin*2) - (x_gap*(tabler[row].content.length - 1))) / (tabler[row].content.length - 1);
                    let x_stepper = 0;
                    x_stepper += x_margin;
                    for (let i in tabler[row].content) {
                        printLabeledText(tabler[row].content[i], x_stepper, stepper + (font_size/2), font_size);
                        x_stepper += fieldFullTextLength(tabler[row].content[i], font_size) + x_gap + spacer;
                    }
                } else {
                    printLabeledText(tabler[row].content[0], (canvas.width/2) - (fieldFullTextLength(tabler[row].content[0], font_size)/2), stepper + (font_size/2), font_size);
                }
                
                stepper += font_size + y_gap;
            }
        }
        
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync('./output/label.png', buffer);
        resolve();
        
        //class functions
        function fieldFullTextLength(content, font_size) {
            result = 0;
            if (!Array.isArray(content)) {
                content = [content];
            }
            for (let i in content) {
                if (content[i].label) {
                    context.font = `bold ${font_size}px ${font_family}`;
                    result += context.measureText(content[i].label + ': ').width;
                }
                context.font = `normal ${font_size}px ${font_family}`;
                result += context.measureText(content[i].data).width;
            }
            return result;
        }
        
        function printLabeledText(content, x, y, font_size) {
            x_stepper = x;
            if (content.label) {
                context.font = `bold ${font_size}px ${font_family}`;
                context.fillText(content.label + ': ', x_stepper, y);
                x_stepper += context.measureText(content.label + ': ').width;
            }
            context.font = `normal ${font_size}px ${font_family}`;
            context.fillText(content.data, x_stepper, y);
        }
    });
};