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

@Component({
  templateUrl: './consegna-new.component.html',
})

// Component class
export class ConsegnaNewComponent implements OnInit, OnDestroy {

public name = 'Atti - Inserimento del ' + moment().format("YYYYMMDD");
public action:any;
private sub: any;

public items: any;
public item: any;
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
  console.log('CONSEGNA_NEW:ngOnInit:new');

  this.sub = this._route.params.subscribe(params => {
    const id = +params['id']; // (+) converts string 'id' to a number
    this.getConsegna({id: id});
    // In a real app: dispatch action to load the details here.
 });

  // this.getAtti({dataricerca : this.oggi});
}

ngOnDestroy() {
  console.log('CONSEGNA_NEW:ngOnDestroy');
  console.log('CONSEGNA_NEW:ngOnDestroy:unsubscribe');
  this.sub.unsubscribe();
  // this.socketConnection.unsubscribe();
}

/*
submitSearch(modelSearch) {
  console.log('CONSEGNA_NEW:submitSearch');
  this.form2show = 0;
  console.log(this.modelSearch);
  this.getAtti(this.modelSearch);
}
*/

submitNew(modelNew) {
  console.log('CONSEGNA_NEW:submitNew');
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

getConsegna(ops) {
  console.log('CONSEGNA_NEW:getConsegna');
  this._appService.getConsegna(ops).subscribe(
      data => {
        console.log(data[0]);
        this.item = data[0];
      },
      err => console.log(err),
      () => console.log('CONSEGNA_NEW:getConsegna done loading atti')
    );
}

getAtti(ops) {
  console.log('CONSEGNA_NEW:getAtti');
  this._appService.getAtti(ops).subscribe(
      data => {
        console.log(data);
        this.items = data;
      },
      err => console.log(err),
      () => console.log('CONSEGNA_NEW:getAtti done loading atti')
    );
}

getAttiConsegnatari() {
  console.log('CONSEGNA_NEW:getAttiConsegnatari');
  var ops = {};
  this._appService.getAttiConsegnatari(ops).subscribe(
      data => { 
        console.log(data);
        this.attiConsegnatari = data;
      },
      err => console.log(err),
      () => console.log('CONSEGNA_NEW:getAttiConsegnatari done loading atti')
    );
}

getInfo() {
  this._appService.getStatus().subscribe(
    data => {
      console.log(data);
    },
    err => console.log(err),
    () => console.log('CONSEGNA_NEW:getInfo')
  );

}

stampaRicevuta(item) {
  console.log('CONSEGNA_NEW:stampaRicevuta');
  this._reportService.stampaRicevuta(item);

}


/*
resetFormConsegna(){
  console.log('CONSEGNA_NEW:resetForm Consegna ..');
  this.form2show = 0;
}
*/


filterValue(obj, key, value) {
  return obj.find(function(v){ return v[key] === value});
}


showModificaAttoForm(item) {
  console.log('CONSEGNA_NEW:showModificaAttoForm show form! ..');
  console.log(item);
  this.form2show = item.id;
  this.lastInsertedId = item.id;
  this.modelModifica.nominativo = item.atti_nominativo;
  this.modelModifica.cronologico = item.atti_cronologico;
  this.modelModifica.consegnatario = item.atti_consegnatario_codice;
}

hideModificaAttoForm(){
  console.log('CONSEGNA_NEW:hideModificaAttoForm Consegna ..');
  this.form2show = 0;
}

updateAtto(id){
  console.log('CONSEGNA_NEW:updateAtto');
  console.log(id);
  console.log(this.modelModifica);

  this.modelModifica.id = id;
  this._appService.updateAtti(this.modelModifica).subscribe(
    data => { 
      console.log('CONSEGNA_NEW:updateAtto SUCCESS!');
      console.log(data);
      this.modelNew.nominativo = '';
      this.modelNew.cronologico = '';
      this.getAtti({dataricerca : this.oggi});
      this.form2show = 0;
      this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
    },
    err => { console.log(err); this._toastr.error('Errore - Aggiornamento errato', err.statusText); },
    () => console.log('CONSEGNA_NEW:updateAtto completed!')
  );
}

/*
aggiungiAllaConsegna(item) {
  console.log('CONSEGNA_NEW:aggiungiAllaConsegna');
  console.log(item);
  this._appService.carrello.push(item);
  console.log(this._appService.carrello);
}
*/

}