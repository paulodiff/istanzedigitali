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


var frazioni = fs.readFileSync("./tmp/frazioni.txt", "utf-8");
var frazioniArray = frazioni.split("\r\n");

var geometria = fs.readFileSync("./tmp/geometria.txt", "utf-8");
var geometriaArray = geometria.split("\r\n");

var geo1 = r.pick(geometriaArray);
var geo2 = r.pick(geometriaArray);
var fraz1 = r.pick(frazioniArray);


var tempi = fs.readFileSync("./tmp/tempi.txt", "utf-8");
var tempiArray = tempi.split("\r\n");
//console.log(paroleSempliciArray);
var paroleSempliciSample =  r.sample(paroleSempliciArray,5); 
var paroleSempliciSample2 =  r.sample(paroleSempliciArray,5);
//console.log(paroleSempliciSample);
var paroleSempliciTxt = paroleSempliciSample.join();
var paroleSempliciTxt2 = paroleSempliciSample2.join();
console.log(paroleSempliciTxt);
console.log(paroleSempliciTxt2);
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
 
var op3 = '';
for (i=0; i< 5; i++){
    op3 += (r.integer(1, 20) + r.pick(simboli)[0] + r.integer(1, 20) + ' = _____,');
} 
 
var templateFileName = './tmp/compito.txt';
fileContents = fs.readFileSync(templateFileName).toString();
var pdf = require('handlebars-pdf');
var document = {
        template: fileContents,
        context: {
            operazione: 'Hello world', 
            paroleSemplici: paroleSempliciTxt,
            paroleSemplici2: paroleSempliciTxt2,
            verbo: verbo,
            declinazione: declinazione,
            op1: op1,
            op2: op2,
            op3: op3,
            tabellina: tabellina,
            geo1: escapeHtml(geo1),
            geo2: escapeHtml(geo2),
            fraz1: escapeHtml(fraz1)
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

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    'è': '&egrave;',
    'à': '&agrave;',
    '-': '&#8211;'       
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}