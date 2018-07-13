// Import component decorator
import { Component } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { AppService} from '../services/app.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  templateUrl: './cat-list.component.html',
})

// Component class
export class CatListComponent  {

name = 'Gestione Atti';

public items: any;

// form ricerca

formSearch = new FormGroup({});
modelSearch: any = {};
optionsSearch: FormlyFormOptions = {};

fieldsSearch: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-4',
          type: 'input',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo',
          },
        },
        {
          className: 'col-4',
          type: 'input',
          key: 'cronologico',
          templateOptions: {
            label: 'Cronologico',
          }
        },
        {
          className: 'col-4',
          key: 'maxnumrighe',
          type: 'select',
          defaultValue: '100',
          templateOptions: {
            label: 'Max righe',
            options: [
              { label: '10', value: '10' },
              { label: '100', value: '100' },
              { label: '1000', value: '1000' },
            ],
          },
        }
      ],
    }
];

// form New

formNew = new FormGroup({});
modelNew: any = {};
optionsNew: FormlyFormOptions = {};

fieldsNew: FormlyFieldConfig[] = [
    {
      template: '<hr>'
    },
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
          },
          parsers: [this.toUpperCase],
          formatters: [this.toUpperCase]
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
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.nominativo',
          }
        },
        {
          className: 'col-3',
          type: 'button',
          btnType: 'warning',
          templateOptions: {
            text: 'Inserisci',
            label: 'Azione',
            onClick: ($event) => {console.log(this.formNew.valid); this.submitNew(this.modelNew); }
          },
          expressionProperties: {
            'templateOptions.disabled': '!model.nominativo',
          }
        },
      ],
    },
    {
      template: '<hr>'
    }
];

constructor(private _appService: AppService, private _toastr: ToastrService) {
  // this.items = db.collection('/items').valueChanges();
  // https://jsonplaceholder.typicode.com/todos
}

toUpperCase(value) {
  return (value || '').toUpperCase();
}

ngOnInit() {   this.getAtti({});  }

submitSearch(modelSearch) {
  console.log(this.modelSearch);
  this.getAtti(this.modelSearch);
}

submitNew(modelNew) {
  console.log('submitNew');
  console.log(this.modelNew);
  this._appService.saveAtti(this.modelNew).subscribe(
    data => { 
      console.log(data);
    },
    err => { console.log('ERRORE:'); console.log(err);},
    () => { console.log('submitNew ok reload!'); this.getAtti({}); }
  );
  // this.getTodos(this.modelSearch);
}

getAtti(ops) {
  console.log('...getAtti');
  this._appService.getAtti(ops).subscribe(
      data => { 
        console.log(data);
        this.items = data;
      },
      err => console.log(err),
      () => console.log('done loading atti')
    );
}

eliminaAtto(id){
  console.log(id);
  
  this._toastr.success('Hello world!', 'Toastr fun!');
}

}