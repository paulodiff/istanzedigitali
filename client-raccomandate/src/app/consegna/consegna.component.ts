import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { AppService } from '../services/app.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';

@Component({
    templateUrl: './consegna.component.html'
})

export class ConsegnaComponent implements OnInit, OnDestroy {

public name = 'Consegna ATTI - Elenco atti in consegna';
messages = [];

public consegnaStatus = 0;


initData = 
[
{id: 7, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "RENZI ERCOLE - PROVA!", atti_consegnatario: "UFFICIALI  GIUDIZIARI", atti_cronologico: '9999'},
{id: 8, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "RENZI ERCOLE", atti_consegnatario: "UFFICIALI  GIUDIZIARI",atti_cronologico: '1119999'},
{id: 9, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "BARONE GIORGIO", atti_consegnatario: "UFFICIALI  GIUDIZIARI"}
];


//  form Consegna

public formConsegna = new FormGroup({});
public modelConsegna: any = {};
public optionsConsegna: FormlyFormOptions = {};

public fieldsConsegna: FormlyFieldConfig[] = [
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
          type: 'input',
          key: 'nominativo',
          templateOptions: {
            label: 'Nominativo Consegna',
            required: true
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
            label: 'Estremi documento identificativo',
            required: true
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
          }
          //,expressionProperties: {
          //  'templateOptions.disabled': '!model.nominativo',
          //}
        }
      ],
    }
];

  constructor(  private _socketService: SocketService,
                private _toastr: ToastrService,
                private _route: ActivatedRoute,
                private _router: Router,
                private _appService: AppService ) {}

  sendMessage() {
    // this._socketService.sendMessage(this.message);
    // this.message = '';
  }

  ngOnInit() {

    // this._appService.carrello = this.initData;
    // this.messages = this._appService.carrello;
    this.modelConsegna.nominativo = 'MARIO PROVA TEST ';
    this.modelConsegna.estremidocumento = 'PAT. 2134 - TEST';
    /*
    this.connection = this._socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
    */
  }

  ngOnDestroy() {
    // this.connection.unsubscribe();
  }
  

  removeItemFromList(item){
    console.log('CONSEGNA:remove:');
    console.log(item);

    this._appService.carrello = this._appService.carrello.filter(function(el) {
        return el.id !== item.id;
    });

  }

  buildConsegna(){
    console.log('CONSEGNA:buildConsegna');
    console.log(this.modelConsegna);
    console.log(this.formConsegna.valid);

    if (this._appService.carrello.length == 0 ) {
        this._toastr.error('Non vi sono elementi selezionati', 'Errore!');
        return;
    }

    if (this.formConsegna.valid && this._appService.carrello ) {

        let itemIds = this._appService.carrello.map(function(item) { return item.id; }).join(',');
        this.modelConsegna.idList = itemIds;

        this._appService.saveConsegna(this.modelConsegna).subscribe(
        data => { 
            console.log('CONSEGNA:buildConsegna SUCCESS!');
            console.log(data);
            console.log('consegna:', data.newId);
            this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
            this._appService.carrello = [];
            console.log(this.messages);
            this._router.navigate(['/consegna/visualizzazione/' ,  data.newId ] );
        },
        err => {
            console.log(err);
            this._toastr.error('Errore di controllo nei dati', err.error.msg);
        },
        () => console.log('done loading atti')
        );

    } else {
        this._toastr.error('Mancano i dati obbligatori', 'Errore!');
    }
  }

  updateConsegna(){
    console.log('CONSEGNA:updateConsegna');
    console.log(this.modelConsegna);
    console.log(this.formConsegna.valid);

    if (this._appService.carrello.length == 0 ) {
        this._toastr.error('Non vi sono elementi selezionati', 'Errore!');
    }

    if (this.formConsegna.valid && this._appService.carrello ) {

        let itemIds = this._appService.carrello.map(function(item) { return item.id; }).join(',');
        this.modelConsegna.idList = itemIds;

        this._appService.updateConsegnaAtti(this.modelConsegna).subscribe(
        data => { 
            console.log('ATTI_LIST:Update SUCCESS!');
            console.log(data);
            this._toastr.success('Dati consegna aggiornati con successo', 'Operazione completata!');
            this._appService.carrello = [];
            console.log(this.messages);
        },
        err => { 
            console.log(err);  
            this._toastr.error('Errore di controllo nei dati', err.error.msg);
        },
        () => console.log('done loading atti')
        );

    } else {
        this._toastr.error('Mancano i dati obbligatori', 'Errore!');
    }
  }

}