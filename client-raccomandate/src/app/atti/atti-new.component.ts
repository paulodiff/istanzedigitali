// Import component decorator
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { AppService} from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../services/socket.service';
import { ReportService } from '../services/report.service';
// import { SseEventService } from '../services/sseevent.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { LookupObject } from '../services/lookup-interface';


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
          defaultValue: '0',
          templateOptions: {
            label: 'Consegnatario',
            options: this._appService.consegnatari,
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
          options: this._appService.consegnatari,
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

consegnatari$: Observable<Array<LookupObject>>;

constructor(
            private _appService: AppService,
            private _socketService: SocketService,
            private _reportService: ReportService,
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
  // this.consegnatari$ = this._appService.consegnatari;
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
       case 'newItemMessage':
       case 'updateItemMessage':
        console.log('ATTI_NEW: reloading data...');
        this.getAtti({dataricerca : this.oggi});
        break;

       default: 
       console.log('ATTI_NEW: no action form message type:', message.type);
    }

    // this.messages.push(message);
  });

  console.log('ATTI_NEW:getAtti call');
  // this.getAttiConsegnatari();
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
  if (this.formNew.valid && (this.modelNew.consegnatario > 0) ) {
    this._appService.saveAtti(this.modelNew).subscribe(
      data => {
        this.dataReturned = data;
        console.log(data);
        this.lastInsertedId = this.dataReturned.newId;
      },
      err => { console.log('ERRORE:'); console.log(err);},
      () =>  { 
              console.log('submitNew ok reload!');
              this.formNew.get('consegnatario').patchValue(0);
              this.formNew.get('nominativo').patchValue('');
              this.formNew.get('cronologico').patchValue('');
              // this.modelNew.nominativo = '';
              // this.modelNew.cronologico = '';
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

getAttiConsegnatariBlock() {
  console.log('ATTI_NEW:getAttiConsegnatari');
  var ops = {};
  this._appService.getAttiConsegnatari(ops).subscribe(
      data => { 
        console.log(data);
        this.attiConsegnatari = data;
        return data;
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

stampaReportService(){
  console.log('ATTI_NEW:stampaReportService ..');
  this._reportService.stampaReport(this.items);
}

stampaReport() {
  console.log('ATTI_NEW:stampaReport ..');
 }

showModificaAttoForm(item) {
  console.log('ATTI_NEW:showModificaAttoForm show form! ..');
  console.log(item);
  this.form2show = item.id;
  this.lastInsertedId = item.id;
  this.modelModifica.nominativo = item.atti_nominativo;
  this.modelModifica.cronologico = item.atti_cronologico;
  this.modelModifica.consegnatario = item.atti_consegnatario_id;

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