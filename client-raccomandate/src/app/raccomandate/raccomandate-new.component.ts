// Import component decorator
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { AppService} from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';
// import { SseEventService } from '../services/sseevent.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './atti-new.component.html',
})

// Component class
export class AttiNewComponent implements OnInit, OnDestroy {

public name = 'Atti - Inserimento del ' + moment().format("YYYYMMDD");
public action:any;
private sub:any;

public items: any;
public attiConsegnatari: any;
public form2show = 131102;
public oggi = moment().format("DD/MM/YYYY");
public lastInsertedId:any;
public dataReturned:any;
public sseEventBus:any;
public socketConnection:any;

// form New

public formNew = new FormGroup({});
public modelNew: any = {};
public optionsNew: FormlyFormOptions = {};

public fieldsNew: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-3',
          key: 'consegnatario',
          type: 'select',
          defaultValue: 'MESSI_NOTIFICATORI',
          templateOptions: {
            label: 'Consegnatario',
            options: this._appService.getAttiConsegnatari({}),
            valueProp: 'id',
            labelProp: 'consegnatario_descrizione'
            /*
            options: [
              { label: 'MESSI_NOTIFICATORI', value: 'MESSI_NOTIFICATORI' },
              { label: 'UFFICI_GIUDIZIARI', value: 'UFFICI_GIUDIZIARI' }
            ],
            */
          },
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo',
            required: true
          }
          // ,parsers: [this.toUpperCase],
          // formatters: [this.toUpperCase]
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'cronologico',
          templateOptions: {
            label: 'Cronologico',
            required: true
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        },
        {
          className: 'col-3',
          type: 'button',
          templateOptions: {
            btnType: 'btn btn-success',
            text: 'Inserisci',
            label: 'Azione',
            onClick: ($event) => {console.log(this.formNew.valid); this.submitNew(this.modelNew); }
          }
        },
      ],
    }
];

// form Modifica

public formModifica = new FormGroup({});
public modelModifica: any = {};
public optionsModifica: FormlyFormOptions = {};

public fieldsModifica: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        /*{
          className: 'col-4',
          type: 'input',
          key: 'dataconsegna',
          templateOptions: {
            label: 'Data Consegna',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },*/
        {
          className: 'col-3',
          key: 'consegnatario',
          type: 'select',
          defaultValue: 'MESSI_NOTIFICATORI',
          templateOptions: {
            label: 'Consegnatario',
            /*
            options: [
              { label: 'MESSI_NOTIFICATORI', value: 'MESSI_NOTIFICATORI' },
              { label: 'UFFICI_GIUDIZIARI', value: 'UFFICI_GIUDIZIARI' }
            ],
            */
          options: this._appService.getAttiConsegnatari({}),
          valueProp: 'id',
          labelProp: 'consegnatario_descrizione'
          },
        },
        {
          className: 'col-4',
          type: 'input',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        },
        
        {
          className: 'col-4',
          type: 'input',
          key: 'cronologico',
          templateOptions: {
            label: 'Cronologico',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        }
      ],
    }
];


constructor(
            private _appService: AppService,
            private _socketService: SocketService,
            private _route: ActivatedRoute,
            private _toastr: ToastrService
          ) {
  // this.items = db.collection('/items').valueChanges();
  // https://jsonplaceholder.typicode.com/todos
}

toUpperCase(value) {
  return (value || '').toUpperCase();
}

ngOnInit() {
  console.log('ATTI_NEW:ngOnInit:new');
  /*
  this.sub = this._route.params.subscribe(params => {
    this.action = params['action'];
    console.log(this.action);
    this.name = 'ATTI - ' + this.action.toUpperCase() + ' - ' + moment().format("DD/MM/YYYY");

    // inserimenti imposta la data di lavoro ad oggi
  });
  */

  this.socketConnection = this._socketService.getMessages().subscribe(message => {
    console.log('ATTI_NEW:message received from socket!');
    console.log(message);

    switch (message.type)
    {
       case "newItemMessage":
        console.log('ATTI_NEW: reloading data...');
        this.getAtti({dataricerca : this.oggi});
        break;

       default: 
       console.log('ATTI_NEW: no action form message type:', message.type);
    }

    // this.messages.push(message);
  });

  console.log('ATTI_NEW:getAtti call');
  this.getAttiConsegnatari();
  this.getAtti({dataricerca : this.oggi});
}

ngOnDestroy() {
  console.log('ATTI_NEW:ngOnDestroy');
  console.log('ATTI_NEW:ngOnDestroy:unsubscribe');
  this.socketConnection.unsubscribe();
}

/*
submitSearch(modelSearch) {
  console.log('ATTI_NEW:submitSearch');
  this.form2show = 0;
  console.log(this.modelSearch);
  this.getAtti(this.modelSearch);
}
*/

submitNew(modelNew) {
  console.log('ATTI_NEW:submitNew');
  console.log(this.modelNew);
  if (this.formNew.valid) {
    this._appService.saveAtti(this.modelNew).subscribe(
      data => {
        this.dataReturned = data;
        console.log(data);
        this.lastInsertedId = this.dataReturned.newId;
      },
      err => { console.log('ERRORE:'); console.log(err);},
      () =>  { 
              console.log('submitNew ok reload!'); 
              //this.modelNew.nominativo = '';
              //this.modelNew.cronologico = '';
              this.getAtti({dataricerca : this.oggi});
              // this._socketService.sendMessage({action: 'updateMessage'});
              this._toastr.success('Atto inserito!', 'Tutto ok!');
      }
    );
  } else {
    this._toastr.error('Dati non validi!', 'Inserire i dati obbligatori!');
  }
  // this.getTodos(this.modelSearch);
}

getAtti(ops) {
  console.log('ATTI_NEW:getAtti');
  this._appService.getAtti(ops).subscribe(
      data => {
        console.log(data);
        this.items = data;
      },
      err => console.log(err),
      () => console.log('ATTI_NEW:getAtti done loading atti')
    );
}

getAttiConsegnatari() {
  console.log('ATTI_NEW:getAttiConsegnatari');
  var ops = {};
  this._appService.getAttiConsegnatari(ops).subscribe(
      data => { 
        console.log(data);
        this.attiConsegnatari = data;
      },
      err => console.log(err),
      () => console.log('ATTI_NEW:getAttiConsegnatari done loading atti')
    );
}

getInfo() {
  this._appService.getStatus().subscribe(
    data => { 
      console.log(data);
    },
    err => console.log(err),
    () => console.log('ATTI_NEW:getInfo')
  );

}


/*
eliminaAtto(id){
  console.log(id);
  this._toastr.success('Hello world!', 'Toastr fun!');
}
*/

/*

updateConsegna(id){
  console.log('ATTI_NEW:Update Consegna');
  console.log(id);
  console.log(this.modelConsegna);
  this.modelConsegna.id = id;
  this._appService.updateConsegnaAtti(this.modelConsegna).subscribe(
    data => { 
      console.log('ATTI_NEW:Update SUCCESS!');
      console.log(data);
      this.form2show = 0;
      this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
    },
    err => console.log(err),
    () => console.log('done loading atti')
  );
}
*/

/*
showConsegnaForm(id){
  console.log('ATTI_NEW:showConsegnaForm Consegna ..');
  console.log(id);
  this.form2show = id;
  this.lastInsertedId = id;
}
*/

/*
resetFormConsegna(){
  console.log('ATTI_NEW:resetForm Consegna ..');
  this.form2show = 0;
}
*/


filterValue(obj, key, value) {
  return obj.find(function(v){ return v[key] === value});
}

// controlla se la notifica di aggiornamento ha modificato la lista in visualizzazione
updateListFromMessage(msg){
  console.log('ATTI_NEW:updateListFromMessage ..');

  // solo se ricerca
  if (this.action == 'ricerca') {
    var itemId  = msg.msg.id;
    console.log(this.items);
    console.log('ATTI_NEW: search for ', itemId);

    for (var i in this.items) {
      if (this.items[i].id == itemId) {
        console.log('ATTI_NEW: ITEM FOUND update!');
        this.items[i].atti_note = msg.msg.atti_note + ' @@ ';
        this.items[i].atti_documento = msg.msg.atti_documento;
        this.items[i].atti_soggetto = msg.msg.atti_soggetto;
        this.items[i].atti_flag_consegna = msg.msg.atti_flag_consegna;
        break; //Stop this loop, we found it!
      }
    }
  }

}

stampaReport() {

  let contenutoStampa = [];
  let elencoTabellare = [];
  let progressivo = 1;
  let tableWidhts = [];

  elencoTabellare.push([ 'Progr.', 'Data', 'Nominativo', 'Data Consegna - Documento - Firma  ', 'Progr' ]);
  tableWidhts =        [ 50,        65,     150,         '*',                                     60 ];

  this.items.forEach(function(obj){
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
  contenutoStampa.push({ text: 'Totale: ' + this.items.length , fontSize: 12, bold: true, margin: [0, 0, 0, 8] });

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

showModificaAttoForm(item) {
  console.log('ATTI_NEW:showModificaAttoForm show form! ..');
  console.log(item);
  this.form2show = item.id;
  this.lastInsertedId = item.id;
  this.modelModifica.nominativo = item.atti_nominativo;
  this.modelModifica.cronologico = item.atti_cronologico;
  this.modelModifica.consegnatario = item.atti_consegnatario_codice;
    
}

hideModificaAttoForm(){
  console.log('ATTI_NEW:hideModificaAttoForm Consegna ..');
  this.form2show = 0;
}

updateAtto(id){
  console.log('ATTI_NEW:updateAtto');
  console.log(id);
  console.log(this.modelModifica);

  this.modelModifica.id = id;
  this._appService.updateAtti(this.modelModifica).subscribe(
    data => { 
      console.log('ATTI_NEW:updateAtto SUCCESS!');
      console.log(data);
      this.modelNew.nominativo = '';
      this.modelNew.cronologico = '';
      this.getAtti({dataricerca : this.oggi});
      this.form2show = 0;
      this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
    },
    err => { console.log(err); this._toastr.error('Errore - Aggiornamento errato', err.statusText); },
    () => console.log('ATTI_NEW:updateAtto completed!')
  );
}

/*
aggiungiAllaConsegna(item) {
  console.log('ATTI_NEW:aggiungiAllaConsegna');
  console.log(item);
  this._appService.carrello.push(item);
  console.log(this._appService.carrello);
}
*/

}