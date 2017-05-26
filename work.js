/*

2) data e ora
1) lettura
2) testo con 5 parole
3) coniugazione dei verbi
4) operazioni del venti
5) tabellina

*/
var simboli = ['+','-'];
var Random = require('random-js');
var fs = require('fs');
r = new Random(); // same as new Random(Random.engines.nativeMath)
// console.log(r.integer(1, 10));
var paroleSemplici = fs.readFileSync("./tmp/parole-semplici.txt", "utf-8");
var paroleSempliciArray = paroleSemplici.split("\r\n");
var verbiIrregolari = fs.readFileSync("./tmp/verbi-irregolari.txt", "utf-8");
var verbiIrregolariArray = verbiIrregolari.split("\r\n");
var tempi = fs.readFileSync("./tmp/tempi.txt", "utf-8");
var tempiArray = tempi.split("\r\n");
//console.log(paroleSempliciArray);
var paroleSempliciSample =  r.sample(paroleSempliciArray,5); 
//console.log(paroleSempliciSample);
var paroleSempliciTxt = paroleSempliciSample.join();
console.log(paroleSempliciTxt);
console.log(r.pick(simboli)); 
console.log(r.sample(tempiArray,1)[0]); 
var declinazione = r.sample(tempiArray,1)[0];
var verbo = r.sample(verbiIrregolariArray,1)[0];
var tabellina = r.integer(6, 10);

var op1 = '';
for (i=0; i< 5; i++){
    op1 += (r.integer(1, 20) + r.pick(simboli)[0] + r.integer(1, 20) + ' = _____,');
}

var op2 = '';
for (i=0; i< 5; i++){
    op2 += (r.integer(1, 20) + r.pick(simboli)[0] + r.integer(1, 20) + ' = _____,');
}
 
 
var templateFileName = './tmp/compito.txt';
fileContents = fs.readFileSync(templateFileName).toString();
var pdf = require('handlebars-pdf');
var document = {
        template: fileContents,
        context: {
            operazione: 'Hello world', 
            paroleSemplici: paroleSempliciTxt,
            verbo: verbo,
            declinazione: declinazione,
            op1: op1,
            op2: op2,
            tabellina: tabellina  
        },
        path: "./tmp/AAA-"+Math.random()+".pdf" 
    } 
  
pdf.create(document)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })

//var template = handlebars.compile(fileContents);
//htmlResponseMsg = template(objFieldSanitized);
