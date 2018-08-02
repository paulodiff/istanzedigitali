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
import { ReportService } from '../services/report.service';
import * as moment from 'moment';


@Component({
  templateUrl: './raccomandate-new.component.html'
})

// Component class
export class RaccomandateNewComponent implements OnInit, OnDestroy {

public name = 'Raccomandate - Inserimento del ' + moment().format('"YYYYMMDD');
public action:any;
private sub:any;

public items: any;
public attiConsegnatari: any;
public form2show = 131102;
public oggi = moment().format('DD/MM/YYYY');
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
          className: 'col-4',
          key: 'destinatario',
          type: 'select',
          defaultValue: '1',
          templateOptions: {
            label: 'Destinatario',
            options: this._appService.destinatariRaccomandate,
            valueProp: 'id',
            labelProp: 'destinatario_descrizione'
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
          key: 'mittente',
          templateOptions: {
            label: 'Mittente',
            required: true
          }
          // ,parsers: [this.toUpperCase],
          // formatters: [this.toUpperCase]
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'numero',
          templateOptions: {
            label: 'Numero',
            required: true
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        },
        {
          className: 'col-2',
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
          className: 'col-4',
          key: 'destinatario',
          type: 'select',
          defaultValue: '1',
          templateOptions: {
            label: 'Destinatario',
            /*
            options: [
              { label: 'MESSI_NOTIFICATORI', value: 'MESSI_NOTIFICATORI' },
              { label: 'UFFICI_GIUDIZIARI', value: 'UFFICI_GIUDIZIARI' }
            ],
            */
          options: this._appService.destinatariRaccomandate,
          valueProp: 'id',
          labelProp: 'destinatario_descrizione'
          },
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'mittente',
          templateOptions: {
            label: 'Mittente',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        },
        
        {
          className: 'col-3',
          type: 'input',
          key: 'numero',
          templateOptions: {
            label: 'Numero',
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
            private _reportService: ReportService,
            private _toastr: ToastrService
          ) {
  // this.items = db.collection('/items').valueChanges();
  // https://jsonplaceholder.typicode.com/todos
}

toUpperCase(value) {
  return (value || '').toUpperCase();
}

ngOnInit() {
  console.log('RACCOMANDATE_NEW:ngOnInit:new');
  /*
  this.sub = this._route.params.subscribe(params => {
    this.action = params['action'];
    console.log(this.action);
    this.name = 'ATTI - ' + this.action.toUpperCase() + ' - ' + moment().format("DD/MM/YYYY");

    // inserimenti imposta la data di lavoro ad oggi
  });
  */

  
  this.socketConnection = this._socketService.getMessages().subscribe(message => {
    console.log('RACCOMANDATE_NEW:message received from socket!');
    console.log(message);

    switch (message.type)
    {
       case 'newItemMessage':
        console.log('RACCOMANDATE_NEW: reloading data...');
        this.getRaccomandate({dataricerca : this.oggi});
        break;

       default: 
       console.log('RACCOMANDATE_NEW: no action for message type:', message.type);
    }

    // this.messages.push(message);
  });


  console.log('RACCOMANDATE_NEW:getRaccomandate call');
  // this.getDestinatariRaccomandate();
    this.getRaccomandate({dataricerca : this.oggi});
  }

ngOnDestroy() {
  console.log('RACCOMANDATE_NEW:ngOnDestroy');
  console.log('RACCOMANDATE_NEW:ngOnDestroy:unsubscribe');
  this.socketConnection.unsubscribe();
}

/*
submitSearch(modelSearch) {
  console.log('RACCOMANDATE_NEW:submitSearch');
  this.form2show = 0;
  console.log(this.modelSearch);
  this.getAtti(this.modelSearch);
}
*/

submitNew(modelNew) {
  console.log('RACCOMANDATE_NEW:submitNew');
  console.log(this.modelNew);
  if (this.formNew.valid) {
    this._appService.saveRaccomandata(this.modelNew).subscribe(
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
              this.getRaccomandate({dataricerca : this.oggi});
              // this._socketService.sendMessage({action: 'updateMessage'});
              this._toastr.success('Atto inserito!', 'Tutto ok!');
      }
    );
  } else {
    this._toastr.error('Dati non validi!', 'Inserire i dati obbligatori!');
  }
  // this.getTodos(this.modelSearch);
}

getRaccomandate(ops) {
  console.log('RACCOMANDATE_NEW:getRaccomandate');
  this._appService.getRaccomandate(ops).subscribe(
      data => {
        console.log(data);
        this.items = data;
      },
      err => console.log(err),
      () => console.log('RACCOMANDATE_NEW:getRaccomandate done loading atti')
    );
}

/*
getDestinatariRaccomandate() {
  console.log('RACCOMANDATE_NEW:getAttiConsegnatari');
  var ops = {};
  this._appService.getAttiConsegnatari(ops).subscribe(
      data => { 
        console.log(data);
        this.attiConsegnatari = data;
      },
      err => console.log(err),
      () => console.log('RACCOMANDATE_NEW:getAttiConsegnatari done loading atti')
    );
}
*/




filterValue(obj, key, value) {
  return obj.find(function(v){ return v[key] === value});
}

// controlla se la notifica di aggiornamento ha modificato la lista in visualizzazione
updateListFromMessage(msg){
  console.log('RACCOMANDATE_NEW:updateListFromMessage ..');

  // solo se ricerca
  if (this.action == 'ricerca') {
    var itemId  = msg.msg.id;
    console.log(this.items);
    console.log('RACCOMANDATE_NEW: search for ', itemId);

    for (var i in this.items) {
      if (this.items[i].id == itemId) {
        console.log('RACCOMANDATE_NEW: ITEM FOUND update!');
        this.items[i].atti_note = msg.msg.atti_note + ' @@ ';
        this.items[i].atti_documento = msg.msg.atti_documento;
        this.items[i].atti_soggetto = msg.msg.atti_soggetto;
        this.items[i].atti_flag_consegna = msg.msg.atti_flag_consegna;
        break; //Stop this loop, we found it!
      }
    }
  }

}


showModificaAttoForm(item) {
  console.log('RACCOMANDATE_NEW:showModificaAttoForm show form! ..');
  console.log(item);
  this.form2show = item.id;
  this.lastInsertedId = item.id;
  this.modelModifica.mittente = item.raccomandate_mittente;
  this.modelModifica.numero = item.raccomandate_numero;
  this.modelModifica.destinatario = item.raccomandate_destinatario_codice;
}

hideModificaAttoForm(){
  console.log('RACCOMANDATE_NEW:hideModificaAttoForm Consegna ..');
  this.form2show = 0;
}

updateRaccomandata(id){
  console.log('RACCOMANDATE_NEW:updateRaccomandata');
  console.log(id);
  console.log(this.modelModifica);

  this.modelModifica.id = id;
  this._appService.updateRaccomandata(this.modelModifica).subscribe(
    data => { 
      console.log('RACCOMANDATE_NEW:updateRaccomandata SUCCESS!');
      console.log(data);
      this.modelNew.nominativo = '';
      this.modelNew.cronologico = '';
      this.getRaccomandate({dataricerca : this.oggi});
      this.form2show = 0;
      this._toastr.success('Dati raccomandata aggiornati con successo', 'Operazione completata!');
    },
    err => { console.log(err); this._toastr.error('Errore - Aggiornamento errato', err.statusText); },
    () => console.log('RACCOMANDATE_NEW:updateRaccomandata completed!')
  );
}

stampaReport() {
  console.log('RACCOMANDATE_LIST:stampaReport');
  this._reportService.stampaRaccomandata(this.items);
}

}