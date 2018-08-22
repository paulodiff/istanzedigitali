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
  templateUrl: './stats-list.component.html',
})

// Component class
export class StatsListComponent implements OnInit, OnDestroy {

public name = 'Statistiche';
public action: any;
private sub: any;

public items: any;
public form2show = 131102;
public oggi = moment().format('DD/MM/YYYY');
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
/*
        {
          className: 'col-6',
          type: 'select',
          key: 'tipoStatistica',
          templateOptions: {
            label: 'tipo',
            options: [
              { value: '1', label: 'Raccomandate per dipendente' },
              { value: '2', label: 'Atti per dipendente' },
              { value: '3', label: 'Atti per mittente' },
              { value: '4', label: 'Atti inseriti per dipendente' },
              { value: '5', label: 'Atti consegnati per dipendente' }
            ],
          }
        },
*/        
        {
          className: 'col-4',
          type: 'inputR',
          key: 'anno',
          validators: {
            fieldMatch: {
              expression: (control) => {
                const value = control.value;
                console.log(control.value);
                this.items = [];
                return control.value;
                // return value.passwordConfirm === value.password  || (!value.passwordConfirm || !value.password);
              },
              message: 'Password Not Matching',
              errorPath: 'passwordConfirm',
            }
          },
          templateOptions: {
            label: 'Anno',
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
  console.log('STATS_LIST:ngOnInit');
  /*
  this.sub = this._route.params.subscribe(params => {
    this.action = params['action'];
    console.log(this.action);
    // this.name = 'ATTI - ' + this.action.toUpperCase() + ' - ' + moment().format("DD/MM/YYYY");

    // inserimenti imposta la data di lavoro ad oggi
  });
  */
  this.modelSearch.anno = 2018;
  console.log('STATS_LIST:getAtti call');
  this.getStats(this.modelSearch);

}


ngOnDestroy() {
  console.log('STATS_LIST:ngOnDestroy');

}


submitSearch(modelSearch) {
  console.log('STATS_LIST:submitSearch');
  this.form2show = 0;
  console.log(this.modelSearch);
  this.getStats(this.modelSearch);
}


getStats(ops) {
  console.log('STATS_LIST:getStats');
  this._appService.getStats(ops).subscribe(
      data => { 
        console.log(data);
        this.items = data;

        // calcolo dei totali

        let sum = this.items.AttiConsegnatario.reduce((accum, obj) => accum + obj.atti_count, 0);
        this.items.AttiConsegnatarioTotale = sum;

        sum = this.items.AttiConsegnatiOperatore.reduce((accum, obj) => accum + obj.atti_count, 0);
        this.items.AttiConsegnatiOperatoreTotale = sum;

        sum = this.items.AttiOperatore.reduce((accum, obj) => accum + obj.atti_count, 0);
        this.items.AttiOperatoreTotale = sum;

        sum = this.items.AttiConsegnatiOperatore.reduce((accum, obj) => accum + obj.atti_count, 0);
        this.items.AttiConsegnatiOperatoreTotale = sum;

        sum = this.items.RaccomandateDestinatario.reduce((accum, obj) => accum + obj.raccomandate_count, 0);
        this.items.RaccomandateDestinatarioTotale = sum;

        sum = this.items.RaccomandateOperatore.reduce((accum, obj) => accum + obj.raccomandate_count, 0);
        this.items.RaccomandateOperatoreTotale = sum;

        console.log(this.items);

      },
      err => console.log(err),
      () => console.log('STATS_LIST:getStats done loading atti')
    );
}

eliminaAtto(id){
  console.log(id);
  this._toastr.success('Hello world!', 'Toastr fun!');
}


showConsegnaForm(id){
  console.log('STATS_LIST:showConsegnaForm Consegna ..');
  console.log(id);
  this.form2show = id;
  this.lastInsertedId = id;
}

resetFormConsegna(){
  console.log('STATS_LIST:resetForm Consegna ..');
  this.form2show = 0;
}


filterValue(obj, key, value) {
  return obj.find(function(v){ return v[key] === value});
}

/*
showModificaAttoForm(item) {
  console.log('STATS_LIST:showModificaAttoForm show form! ..');
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
*/

hideModificaAttoForm(){
  console.log('STATS_LIST:hideModificaAttoForm Consegna ..');
  this.form2show = 0;
}


aggiungiAllaConsegna(item) {
  console.log('STATS_LIST:aggiungiAllaConsegna');
  console.log(item);
  let bFound = false;
  this._appService.carrello.forEach(function(el){
    if (el.id === item.id) { bFound = true; }
  });
  if (!bFound) { this._appService.carrello.push(item); }
  console.log(this._appService.carrello);
}

stampaReport() {
  console.log('STATS_LIST:stampaReport');
  this.items.AnnoStatistica = this.modelSearch.anno;
  this._reportService.stampaStatistica(this.items);
}

}