import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

// https://www.metaltoad.com/blog/angular-5-making-api-calls-httpclient-service

/*
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
*/

// Gestore dei report ...
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Injectable()
export class ReportService {
    // http options used for making API calls


    private httpOptions: any;
    
    // the actual JWT token
    public token: string;

    // the token expiration date
    public token_expires: Date;

    // the username of the logged in user
    public username: string;

    public carrello: any = []; 

    // error messages received from the login attempt
    public errors: any = []; 
    configUrl = 'https://jsonplaceholder.typicode.com/users';
    constructor(private http:HttpClient) {

      console.log('APP_SERVICE:build');

      this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

        // TO REMOVE
      this.username = "USER_TEST";
    }

// stampa elenco ATTI

    stampaReport(items) {

        let contenutoStampa = [];
        let elencoTabellare = [];
        let progressivo = 1;
        let tableWidhts = [];
        elencoTabellare.push([ 'Progr.', 'Data', 'Nominativo',
        {text: 'Data Consegna - Documento - Firma  ', alignment: 'right'},
        'Progr' ]);
        tableWidhts =   [ 50, 65, 150, '*', 60 ];

        items.forEach(function(obj){
          elencoTabellare.push([
                {text: obj.id, fontSize: 12, border: [true, false, false, false]},
                {text: moment(obj.atti_data_registrazione).format('DD/MM/YYYY'), fontSize: 12,border: [false, true, false, false]},
                {text: obj.atti_nominativo, colSpan: 2, fontSize: 12, border: [false, false, false, false]},
                '',
                // {text: '', fontSize: 10, border: [false, false, false, false]},
                {text: obj.id, fontSize: 12, alignment: 'right',border: [false, false, true, false]}
          ]);

        elencoTabellare.push([
            {   text: obj.atti_consegnatari.consegnatario_descrizione + ' - ' + obj.atti_cronologico, 
                colSpan: 5, 
                fontSize: 12,
                alignment: 'left', 
                border: [true, false, true, true]
              },
              '',
              '',
              '',
              ''
          ]);
        });

        let tabellaStampa = {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              dontBreakRows: true,
              keepWithHeaderRows: 1,
              headerRows: 1,
              widths: tableWidhts,
              body: elencoTabellare
            }
        };

        /*
        contenutoStampa.push( {
          text: 'Comune di Rimini - Ufficio Protocollo - Deposito atti comunali - Data deposito: ' + moment().format('DD/MM/YYYY'),
          fontSize: 18
        });
        */
        // contenutoStampa.push( { text: 'Matricola: ' + 'MMMMMM', fontSize: 12 } );
        contenutoStampa.push( tabellaStampa );
        contenutoStampa.push({ text: 'Totale: ' + items.length , fontSize: 12, bold: true, margin: [0, 0, 0, 8] });

        /*
        if(numeroPagina == maxPagina){
          contenutoStampa.push({ text: '  ', fontSize: 12, bold: true, margin: [0, 0, 0, 8] });
        }else{
          contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });
        }
        */

        const docDefinition = {
          pageSize: 'A4',
          pageOrientation: 'landscape',
          pageMargins: [ 50, 30, 40, 40 ],
          footer: function(currentPage, pageCount) {
            return    {
                        text: 'pagina ' + currentPage.toString() + ' di ' + pageCount,
                        fontSize: 8,
                        // alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                        alignment: 'right',
                        margin: [8, 8, 40, 0]
                      }
           },
          header: function(currentPage, pageCount) {
             return {
                columns: [
                    {
                        text: 'Comune di Rimini - Ufficio Protocollo - Atti',
                        width: '*',
                        alignment: 'left',
                        fontSize: 12
                    },
                    {
                        text: 'pagina generata il: ' + moment().format('DD/MM/YYYY'), 
                        fontSize: 12,
                        alignment: 'right',
                        width: '*'
                    }
                ],
                margin: [50, 10]
            }

          },
          content: [contenutoStampa]
        };

        pdfMake.createPdf(docDefinition).open();
    }

// RICEVUTA

    stampaRicevuta(consegna) {

        let contenutoStampa = [];
        let elencoTabellare = [];
        let progressivo = 1;
        let tableWidhts = [];

        console.log(consegna);
        
        elencoTabellare.push([ 'Progr.', 'Data', 'Nominativo', 'Consegnatario', 'Cronologico' ]);
        tableWidhts =        [ 50,        65,     150,         '*',                        '*' ];

        consegna.atti_in_consegna.forEach(function(obj){
          elencoTabellare.push([
                {text: obj.attiinconsegna_codice_atto, fontSize: 10, border: [true, true, true, true]},
                {text: moment(obj.codice_atto.atti_data_registrazione).format('DD/MM/YYYY'), fontSize: 10,border: [true, true, true, true]},
                {text: obj.codice_atto.atti_nominativo, fontSize: 10, border: [true, true, true, true]},
                {text: obj.codice_atto.atti_consegnatari.consegnatario_descrizione, fontSize: 10, border: [true, true, true, true]},
                {text: obj.codice_atto.atti_cronologico, fontSize: 10, alignment: 'left',border: [true, true, true, true]}
          ]);

        });

        let tabellaStampa = {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              dontBreakRows: true,
              headerRows: 1,
              widths: tableWidhts,
              body: elencoTabellare
            }
        };

        contenutoStampa.push({
          text: 'Comune di Rimini - Ufficio Protocollo - Ricevuta consegna atti', 
          fontSize: 16
        });

        contenutoStampa.push({
            text: 'Consegna n:' + consegna.id + ' creata il :' + moment(consegna.consegna_data_reg).format('DD/MM/YYYY') ,
            fontSize: 16
        });

        contenutoStampa.push({ 
            text: 'Il sottoscritto ' + consegna.consegna_soggetto,
            fontSize: 16 
        });

        contenutoStampa.push({ 
            text: ' identificato da:' + consegna.consegna_documento,
            fontSize: 16 
        });

        contenutoStampa.push( { 
            text: 'dichiara di ricevere i seguenti atti:', 
            fontSize: 16 } 
        );

        contenutoStampa.push( { 
            text: '', 
            fontSize: 16 } 
        );

        // contenutoStampa.push( { text: 'Matricola: ' + 'MMMMMM', fontSize: 12 } );
        contenutoStampa.push( tabellaStampa );
        contenutoStampa.push( {  text: '-',  fontSize: 30 } );
        contenutoStampa.push( {
            text: 'Firma ___________________________________',
            fontSize: 16 }
        );
        contenutoStampa.push({ text: '' , fontSize: 12, bold: true, margin: [0, 0, 0, 8] });

        /*
        if(numeroPagina == maxPagina){
          contenutoStampa.push({ text: '  ', fontSize: 12, bold: true, margin: [0, 0, 0, 8] });
        }else{
          contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });
        }
        */

        const docDefinition = {
          info: {
                title: 'ric_cons_1234',
                author: 'Comune di Rimini - Protocollo Generale',
                subject: 'Ricevuta consegna atti',
                keywords: 'ricevuta consegna atti',
          },
          pageSize: 'A4',
          // pageOrientation: 'landscape',
          pageMargins: [ 30, 30, 30, 30 ],
          footer: function(currentPage, pageCount) {
            return    { 
                        text: 'pagina ' + currentPage.toString() + ' di ' + pageCount,
                        alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                      }
           },
          header: function(currentPage, pageCount) {
             return {
                      text: 'pagina generata il: ' + moment().format('DD/MM/YYYY'), fontSize: 8,
                      alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                    };
          },
          content: [contenutoStampa]
        };

        pdfMake.createPdf(docDefinition).open();
        //pdfMake.createPdf(docDefinition).download('optionalName.pdf');
    }


// RACCOMANDATA

stampaRaccomandata(items) {

    let contenutoStampa = [];
    let elencoTabellare = [];
    let progressivo = 1;
    let tableWidhts = [];
    let tabellaStampa =  {};
    let prevDestinatario = 0;
    let prevDestinatarioDescrizione = '';
    let progressivoRaccomandata = 0;


    console.log(items);

    // elencoTabellare.push([ 'Progr.', 'Numero', 'Mittente' ]);
    tableWidhts =        [  50,      150,       '*'       ];

    items.forEach(function(obj) {

        if (prevDestinatario !== obj.raccomandate_destinatario_codice) {

            if (prevDestinatario === 0) { // il primo elemento
                prevDestinatario = obj.raccomandate_destinatario_codice;
                prevDestinatarioDescrizione = obj.raccomandate_destinatari.destinatario_descrizione;
                elencoTabellare.push([ 'Progr.', 'Numero', 'Mittente' ]);
                progressivoRaccomandata = 0;
            } else { // cambio di gruppo chiude la stampa corrente

                contenutoStampa.push({ text: 'Comune di Rimini - Ufficio Protocollo - Raccomandate', fontSize: 18 });
                contenutoStampa.push({ text: 'Settore: ' + prevDestinatarioDescrizione, fontSize: 16 });
                tabellaStampa = {
                    table: {
                      headerRows: 1,
                      widths: tableWidhts,
                      body: elencoTabellare
                    }
                };
                contenutoStampa.push( tabellaStampa );
                contenutoStampa.push({ text: 'Data:' + moment().format('DD/MM/YYYY'), fontSize: 12 });
                contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });
                elencoTabellare = [];
                elencoTabellare.push([ 'Progr.', 'Numero', 'Mittente' ]);
                prevDestinatario = obj.raccomandate_destinatario_codice;
                prevDestinatarioDescrizione = obj.raccomandate_destinatari.destinatario_descrizione;
                progressivoRaccomandata = 0;
            }

        }

        progressivoRaccomandata = progressivoRaccomandata + 1;

        elencoTabellare.push([
            // {text: obj.id, fontSize: 12, border: [true, true, true, true]},
            {text: progressivoRaccomandata, fontSize: 12, border: [true, true, true, true]},
            {text: obj.raccomandate_numero, fontSize: 12, border: [true, true, true, true]},
            {text: obj.raccomandate_mittente, fontSize: 10, border: [true, true, true, true]},
        ]);

    });

    // Ultima pagina
    contenutoStampa.push({ text: 'Comune di Rimini - Ufficio Protocollo - Raccomandate', fontSize: 18 });
    contenutoStampa.push({ text: 'Settore: ' + prevDestinatarioDescrizione, fontSize: 16 });
    tabellaStampa = {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: tableWidhts,
          body: elencoTabellare
        }
    };
    contenutoStampa.push( tabellaStampa );
    contenutoStampa.push({ text: 'Data :' + moment().format('DD/MM/YYYY'), fontSize: 12 });
    contenutoStampa.push({ text: ' ', fontSize: 12, bold: true,  margin: [0, 0, 0, 8] });


    /*
    if(numeroPagina == maxPagina){
      contenutoStampa.push({ text: '  ', fontSize: 12, bold: true, margin: [0, 0, 0, 8] });
    }else{
      contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });
    }
    */

    const docDefinition = {
      info: {
            title: 'raccomandate_stampa_lista',
            author: 'Comune di Rimini - Protocollo Generale',
            subject: 'Elenco Raccomandate',
            keywords: 'Elenco Raccomandate',
      },
      pageSize: 'A4',
      // pageOrientation: 'landscape',
      pageMargins: [ 30, 30, 30, 30 ],
      footer: function(currentPage, pageCount) {
        return   { 
                    text: 'pagina ' + currentPage.toString() + ' di ' + pageCount,
                    alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                  }
       },
      header: function(currentPage, pageCount) {
         return {
                  text: 'pagina generata il: ' + moment().format('DD/MM/YYYY'), fontSize: 8,
                  alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                };
      },
      content: [contenutoStampa]
    };

    pdfMake.createPdf(docDefinition).open();
}

// stampaStatistica

stampaStatistica(items) {

    let contenutoStampa = [];
    let elencoTabellare = [];
    let progressivo = 1;
    let tableWidhts = [];
    let tabellaStampa =  {};
    let prevDestinatario = 0;
    let prevDestinatarioDescrizione = '';


    console.log(items);

    // elencoTabellare.push([ 'Progr.', 'Numero', 'Mittente' ]);
    contenutoStampa.push({ text: 'Comune di Rimini - Ufficio Protocollo - Statistica ' +  items.AnnoStatistica, fontSize: 18 });

    // Atti per consegnatario

    contenutoStampa.push({ text: 'Atti per consegnatario', fontSize: 16 });

    tableWidhts =        [  '*',      '*'  ];

    elencoTabellare.push([
        {text: 'CONSEGNATARIO', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: 'NUMERO', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    items.AttiConsegnatario.forEach(function(obj) {
        elencoTabellare.push([
            {text: obj.atti_consegnatari.consegnatario_descrizione, fontSize: 12, border: [true, true, true, true]},
            {text: obj.atti_count, fontSize: 12, border: [true, true, true, true]},
        ]);
    });
    elencoTabellare.push([
        {text: 'TOTALE', fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: items.AttiConsegnatarioTotale, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    tabellaStampa = {
        table: {
          headerRows: 1,
          widths: tableWidhts,
          body: elencoTabellare
        }
    };
    contenutoStampa.push( tabellaStampa );

    // Atti per operatore
    elencoTabellare = [];
    contenutoStampa.push({ text: 'Atti per operatore', fontSize: 16 });

    tableWidhts =        [  '*',      '*'  ];

    elencoTabellare.push([
        {text: 'OPERATORE', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: 'NUMERO', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    items.AttiOperatore.forEach(function(obj) {
        elencoTabellare.push([
            {text: obj.atti_operatore_inserimento, fontSize: 12, border: [true, true, true, true]},
            {text: obj.atti_count, fontSize: 12, border: [true, true, true, true]},
        ]);
    });
    elencoTabellare.push([
        {text: 'TOTALE', fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: items.AttiOperatoreTotale, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    tabellaStampa = {
        table: {
          headerRows: 1,
          widths: tableWidhts,
          body: elencoTabellare
        }
    };
    contenutoStampa.push( tabellaStampa );

    // Atti per operatore
    elencoTabellare = [];
    contenutoStampa.push({ text: 'Atti consegnati per operatore', fontSize: 16 });

    tableWidhts =        [  '*',      '*'  ];

    elencoTabellare.push([
        {text: 'OPERATORE', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: 'NUMERO', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    items.AttiConsegnatiOperatore.forEach(function(obj) {
        elencoTabellare.push([
            {text: obj.atti_operatore_inserimento, fontSize: 12, border: [true, true, true, true]},
            {text: obj.atti_count, fontSize: 12, border: [true, true, true, true]},
        ]);
    });
    elencoTabellare.push([
        {text: 'TOTALE', fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
        {text: items.AttiConsegnatiOperatoreTotale, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
    ]);
    tabellaStampa = {
        table: {
            headerRows: 1,
            widths: tableWidhts,
            body: elencoTabellare
        }
    };
    contenutoStampa.push( tabellaStampa );

    // pagina nuova
    contenutoStampa.push({ text: ' ', fontSize: 12, bold: true, pageBreak: 'after', margin: [0, 0, 0, 8] });

     // Raccomandate per destinatario
     elencoTabellare = [];
     contenutoStampa.push({ text: 'Raccomandate per destinatario', fontSize: 16 });
 
     tableWidhts =        [  '*',      '*'  ];
 
     elencoTabellare.push([
         {text: 'DESTINATARIO', bold: false, fillColor: '#eeeeee', fontSize: 10, border: [true, true, true, true]},
         {text: 'NUMERO', bold: false, fillColor: '#eeeeee', fontSize: 10, border: [true, true, true, true]},
     ]);
     items.RaccomandateDestinatario.forEach(function(obj) {
         elencoTabellare.push([
             {text: obj.raccomandate_destinatari.destinatario_descrizione, fontSize: 10, border: [true, true, true, true]},
             {text: obj.raccomandate_count, fontSize: 10, border: [true, true, true, true]},
         ]);
     });
     elencoTabellare.push([
         {text: 'TOTALE', fillColor: '#eeeeee', fontSize: 10, border: [true, true, true, true]},
         {text: items.RaccomandateDestinatarioTotale, fillColor: '#eeeeee', fontSize: 10, border: [true, true, true, true]},
     ]);
     tabellaStampa = {
         table: {
             headerRows: 1,
             widths: tableWidhts,
             body: elencoTabellare
         }
     };
     contenutoStampa.push( tabellaStampa );

    // Raccomandate per operatore
     elencoTabellare = [];
     contenutoStampa.push({ text: 'Raccomandate per operatore', fontSize: 16 });
 
     tableWidhts =        [  '*',      '*'  ];
 
     elencoTabellare.push([
         {text: 'OPERATORE', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
         {text: 'NUMERO', bold: false, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
     ]);
     items.RaccomandateOperatore.forEach(function(obj) {
         elencoTabellare.push([
             {text: obj.raccomandate_operatore, fontSize: 12, border: [true, true, true, true]},
             {text: obj.raccomandate_count, fontSize: 12, border: [true, true, true, true]},
         ]);
     });
     elencoTabellare.push([
         {text: 'TOTALE', fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
         {text: items.RaccomandateOperatoreTotale, fillColor: '#eeeeee', fontSize: 12, border: [true, true, true, true]},
     ]);
     tabellaStampa = {
         table: {
             headerRows: 1,
             widths: tableWidhts,
             body: elencoTabellare
         }
     };
     contenutoStampa.push( tabellaStampa );



    contenutoStampa.push({ text: 'Data ritiro:' + moment().format('DD/MM/YYYY'), fontSize: 14 });
    contenutoStampa.push({ text: ' ', fontSize: 12, bold: true,  margin: [0, 0, 0, 8] });


    
    const docDefinition = {
      info: {
            title: 'statistiche_lista',
            author: 'Comune di Rimini - Protocollo Generale',
            subject: 'Statistiche',
            keywords: 'Statistiche',
      },
      pageSize: 'A4',
      // pageOrientation: 'landscape',
      pageMargins: [ 30, 30, 30, 30 ],
      footer: function(currentPage, pageCount) {
        return   { 
                    text: 'pagina ' + currentPage.toString() + ' di ' + pageCount,
                    alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                  }
       },
      header: function(currentPage, pageCount) {
         return {
                  text: 'pagina generata il: ' + moment().format('DD/MM/YYYY'), fontSize: 8,
                  alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                };
      },
      content: [contenutoStampa]
    };

    pdfMake.createPdf(docDefinition).open();
}


}