// Import component decorator
import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { AppService} from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
// import { SseEventService } from '../services/sseevent.service';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../services/report.service';
import * as moment from 'moment';


@Component({
  templateUrl: './atti-list.component.html',
})

// Component class
export class AttiListComponent implements OnInit, OnDestroy {

public name = 'Atti - ricerca - consegna';
public action: any;
private sub: any;

public items: any;
public attiConsegnatari: any;
public form2show = 131102;
public oggi = moment().format("DD/MM/YYYY");
public lastInsertedId: any;
public dataReturned: any;
public sseEventBus: any;

// form ricerca

public formSearch = new FormGroup({});
public modelSearch: any = {};
public optionsSearch: FormlyFormOptions = {};
public fieldsSearch: FormlyFieldConfig[] = [
  {
    fieldGroupClassName: 'row',
    fieldGroup: [
        {
          className: 'col-3',
          type: 'input',
          key: 'dataricerca',
          templateOptions: {
            label: 'Data',
          },
          validators: {
            ip: {
              expression: (c) => /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(c.value),
              message: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" data non valida`,
            },
          },
        },
        {
          className: 'col-3',
          type: 'inputR',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo',
          },
        },
        {
          className: 'col-3',
          type: 'inputR',
          key: 'cronologico',
          templateOptions: {
            label: 'Cronologico',
          }
        },
        {
          className: 'col-3',
          type: 'button',
          templateOptions: {
            btnType: 'btn btn-outline-primary',
            text: 'Ricerca',
            label: 'Azione',
            onClick: ($event) => {console.log(this.formSearch.valid); this.submitSearch(this.modelSearch); }
          }
        }
      ]
    }
];


/*
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
            options: [
              { label: 'MESSI_NOTIFICATORI', value: 'MESSI_NOTIFICATORI' },
              { label: 'UFFICI_GIUDIZIARI', value: 'UFFICI_GIUDIZIARI' }
            ],
          },
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
        {
          className: 'col-3',
          type: 'input',
          key: 'cronologico',
          templateOptions: {
            label: 'Cronologico',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },
        {
          className: 'col-3',
          type: 'button',
          templateOptions: {
            btnType: 'btn btn-outline-primary',
            text: 'Inserisci',
            label: 'Azione',
            onClick: ($event) => {console.log(this.formNew.valid); this.submitNew(this.modelNew); }
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.nominativo',
          }
        },
      ],
    }

];
*/

// form Consegna
/*
public formConsegna = new FormGroup({});
public modelConsegna: any = {};
public optionsConsegna: FormlyFormOptions = {};

public fieldsConsegna: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          type: 'input',
          key: 'dataconsegna',
          templateOptions: {
            label: 'Data Consegna',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
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
          key: 'estremidocumento',
          templateOptions: {
            label: 'Estremi Documento',
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
          key: 'note',
          templateOptions: {
            label: 'Note',
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
*/
// form Modifica

public formModifica = new FormGroup({});
public modelModifica: any = {};
public optionsModifica: FormlyFormOptions = {};
public fieldsModifica: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          key: 'consegnatario',
          type: 'select',
          defaultValue: 'MESSI_NOTIFICATORI',
          templateOptions: {
            label: 'Consegnatario',
            options: this.attiConsegnatari,
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
        }
      ]
    }
  ];
/*
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          type: 'input',
          key: 'dataconsegna',
          templateOptions: {
            label: 'Data Consegna',
          },
          validators: {
            validation: Validators.compose([Validators.required])
          }
        },

        {
          className: 'col-4',
          type: 'input',
          key: 'nominativoConsegna',
          templateOptions: {
            label: 'Nominativo Consegna',
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
          key: 'estremidocumento',
          templateOptions: {
            label: 'Estremi Documento',
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
          key: 'note',
          templateOptions: {
            label: 'Note',
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
*/


constructor(
            private _appService: AppService,
            private _route: ActivatedRoute,
            private _reportService: ReportService,
            private _toastr: ToastrService) {
  // this.items = db.collection('/items').valueChanges();
  // https://jsonplaceholder.typicode.com/todos
}

toUpperCase(value) {
  return (value || '').toUpperCase();
}

ngOnInit() {
  console.log('ATTI_LIST:ngOnInit');
  /*
  this.sub = this._route.params.subscribe(params => {
    this.action = params['action'];
    console.log(this.action);
    // this.name = 'ATTI - ' + this.action.toUpperCase() + ' - ' + moment().format("DD/MM/YYYY");

    // inserimenti imposta la data di lavoro ad oggi
  });
  */

  console.log('ATTI_LIST:getAtti call');
  this.getAttiConsegnatari({});
  this.getAtti({dataricerca : this.oggi});

}


ngOnDestroy() {
  console.log('ATTI_LIST:ngOnDestroy');

}


submitSearch(modelSearch) {
  console.log('ATTI_LIST:submitSearch');
  this.form2show = 0;
  console.log(this.modelSearch);
  this.getAtti(this.modelSearch);
}

/*
submitNew(modelNew) {
  console.log('ATTI_LIST:submitNew');
  console.log(this.modelNew);
  this._appService.saveAtti(this.modelNew).subscribe(
    data => {
      this.dataReturned = data;
      console.log(data);
      this.lastInsertedId = this.dataReturned.newId;
    },
    err => { console.log('ERRORE:'); console.log(err);},
    () => { console.log('submitNew ok reload!'); 
            this.modelNew.nominativo = '';
            this.modelNew.cronologico = '';
            this.getAtti({dataricerca : this.oggi});
            this._toastr.success('Atto inserito!', 'Tutto ok!');
    }
  );
  // this.getTodos(this.modelSearch);
}
*/

getAtti(ops) {
  console.log('ATTI_LIST:getAtti');
  this._appService.getAtti(ops).subscribe(
      data => { 
        console.log(data);
        this.items = data;
      },
      err => console.log(err),
      () => console.log('ATTI_LIST:getAtti done loading atti')
    );
}

getAttiConsegnatari({}) {
  console.log('ATTI_LIST:getAttiConsegnatari');
  this._appService.getAttiConsegnatari({}).subscribe(
      data => { 
        console.log(data);
        this.attiConsegnatari = data;
      },
      err => console.log(err),
      () => console.log('ATTI_LIST:getAttiConsegnatari done loading data!')
    );
}

eliminaAtto(id){
  console.log(id);
  this._toastr.success('Hello world!', 'Toastr fun!');
}

showConsegnaForm(id){
  console.log('ATTI_LIST:showConsegnaForm Consegna ..');
  console.log(id);
  this.form2show = id;
  this.lastInsertedId = id;
}

resetFormConsegna(){
  console.log('ATTI_LIST:resetForm Consegna ..');
  this.form2show = 0;
}


filterValue(obj, key, value) {
  return obj.find(function(v){ return v[key] === value});
}


showModificaAttoForm(item) {
  console.log('ATTI_LIST:showModificaAttoForm show form! ..');
  console.log(item);
  this.form2show = item.id;
  this.lastInsertedId = item.id;
  this.modelModifica.nominativo = item.atti_nominativo;
  this.modelModifica.cronologico = item.atti_cronologico;
  this.modelModifica.consegnatario = item.atti_consegnatario_codice;
  this.modelModifica.nominativoConsegna = item.atti_soggetto;
  this.modelModifica.note = item.atti_note;
  this.modelModifica.estremidocumento = item.atti_documento;
  this.modelModifica.flag_consegna = item.atti_flag_consegna;
}

hideModificaAttoForm(){
  console.log('ATTI_LIST:hideModificaAttoForm Consegna ..');
  this.form2show = 0;
}

updateAtto(id){
  console.log('ATTI_LIST:updateAtto');
  console.log(id);
  console.log(this.modelModifica);

  this.modelModifica.id = id;
  this._appService.updateAtti(this.modelModifica).subscribe(
    data => { 
      console.log('ATTI_LIST:updateAtto SUCCESS!');
      console.log(data);
      this.form2show = 0;
      this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
      this.getAtti(this.modelSearch);
    },
    err => { console.log(err); this._toastr.error('Errore - Aggiornamento errato', err.statusText); },
    () => console.log('ATTI_LIST:updateAtto completed!')
  );
}

aggiungiAllaConsegna(item) {
  console.log('ATTI_LIST:aggiungiAllaConsegna');
  console.log(item);
  let bFound = false;
  this._appService.carrello.forEach(function(el){
    if (el.id === item.id) { bFound = true; }
  });
  if (!bFound) { this._appService.carrello.push(item); }
  console.log(this._appService.carrello);
}

stampaReportService(){
  console.log('ATTI_NEW:stampaReportService ..');
  this._reportService.stampaReport(this.items);
}

}