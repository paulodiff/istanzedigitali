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

    stampaReport(items) {

        let contenutoStampa = [];
        let elencoTabellare = [];
        let progressivo = 1;
        let tableWidhts = [];
        elencoTabellare.push([ 'Progr.', 'Data', 'Nominativo', 'Data Consegna - Documento - Firma  ', 'Progr' ]);
        tableWidhts =        [ 50,        65,     150,         '*',                                     60 ];

        items.forEach(function(obj){
          elencoTabellare.push([
                {text: obj.id, fontSize: 12, border: [true, false, false, false]},
                {text: moment(obj.atti_data_reg).format('DD/MM/YYYY'), fontSize: 12,border: [false, true, false, false]},
                {text: obj.atti_nominativo, fontSize: 12, border: [false, false, false, false]},
                {text: '', fontSize: 10, border: [true, false, false, false]},
                {text: obj.id, fontSize: 12, alignment: 'right',border: [false, false, true, false]}
          ]);

        elencoTabellare.push([
            {   text: obj.atti_consegnatario + ' - ' + obj.atti_cronologico, 
                colSpan: 3, 
                fontSize: 12,
                alignment: 'left', 
                border: [true, false, false, true]
              },
              '',
              '',
            { text: '', 
              colSpan: 2, 
              fontSize: 10,
              alignment: 'center',
              border: [true, false, true, true]
            },
             ''
          ]);
        });

        let tabellaStampa = {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: tableWidhts,
              body: elencoTabellare
            }
        };

        contenutoStampa.push( { 
          text: 'Comune di Rimini - Ufficio Protocollo - Deposito atti comunali - Data deposito: ' + moment().format('DD/MM/YYYY'), fontSize: 18 } 
        );
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
          pageMargins: [ 30, 30, 30, 30 ],
          footer: function(currentPage, pageCount) {
            return    { 
                        text: 'pagina ' + currentPage.toString() + ' di ' + pageCount,
                        alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                      }
           },
          header: function(currentPage, pageCount) {
             return {
                      text: 'Report generato il: ' + moment().format('DD/MM/YYYY'), fontSize: 8,
                      alignment: (currentPage % 2) ? 'left' : 'right', margin: [8, 8, 8, 8]
                    };
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
        
        elencoTabellare.push([ 'Progr.', 'Data', 'Nominativo', 'Data Consegna - Documento - Firma  ', 'Progr' ]);
        tableWidhts =        [ 50,        65,     150,         '*',                                     60 ];

        consegna.atti_in_consegna.forEach(function(obj){
          elencoTabellare.push([
                {text: obj.id, fontSize: 12, border: [true, false, false, false]},
                {text: moment(obj.atti_data_reg).format('DD/MM/YYYY'), fontSize: 12,border: [false, true, false, false]},
                {text: obj.atti_nominativo, fontSize: 12, border: [false, false, false, false]},
                {text: '', fontSize: 10, border: [true, false, false, false]},
                {text: obj.id, fontSize: 12, alignment: 'right',border: [false, false, true, false]}
          ]);

        elencoTabellare.push([
            {   text: obj.atti_consegnatario + ' - ' + obj.atti_cronologico, 
                colSpan: 3, 
                fontSize: 12,
                alignment: 'left', 
                border: [true, false, false, true]
              },
              '',
              '',
            { text: '', 
              colSpan: 2, 
              fontSize: 10,
              alignment: 'center',
              border: [true, false, true, true]
            },
             ''
          ]);
        });

        let tabellaStampa = {
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: tableWidhts,
              body: elencoTabellare
            }
        };

        contenutoStampa.push({
          text: 'Comune di Rimini - Ufficio Protocollo', 
          fontSize: 18
        });

        contenutoStampa.push({
            text: 'Ricevuta per consegna n:' + consegna.id, 
            fontSize: 18
        });

        contenutoStampa.push({ 
            text: 'Il sottoscritto ' + consegna.consegna_soggetto + ' identificato da:' + consegna.consegna_documento, 
            fontSize: 16 
        });

        contenutoStampa.push( { 
            text: 'dichiara di ricevere i seguenti atti ... ', 
            fontSize: 16 } 
        );


        // contenutoStampa.push( { text: 'Matricola: ' + 'MMMMMM', fontSize: 12 } );
        contenutoStampa.push( tabellaStampa );
        contenutoStampa.push({ text: 'Totale: 44' , fontSize: 12, bold: true, margin: [0, 0, 0, 8] });

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
    }





}