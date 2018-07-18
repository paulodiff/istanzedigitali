import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { AppService } from '../services/app.service';

@Component({
    templateUrl: './consegna.component.html'
})

export class ConsegnaComponent implements OnInit, OnDestroy {

    public name = 'Consegna ATTI - Elenco atti in consegna';
    messages = [];
  connection;
  message;
// form Consegna

initData = 
[
{id: 7, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "RENZI ERCOLE - PROVA!", atti_consegnatario: "UFFICIALI  GIUDIZIARI", atti_cronologico: '9999'},
{id: 8, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "RENZI ERCOLE", atti_consegnatario: "UFFICIALI  GIUDIZIARI",atti_cronologico: '1119999'},
{id: 9, atti_data_reg: "2009-01-02T00:00:00.000Z", atti_nominativo: "BARONE GIORGIO", atti_consegnatario: "UFFICIALI  GIUDIZIARI"}
];


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

  constructor(private _socketService: SocketService,
              private _appService: AppService ) {}

  sendMessage() {
    this._socketService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {

    this._appService.carrello = this.initData;
    this.messages = this._appService.carrello;
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
    console.log('remove:');
    console.log(item);

    this._appService.carrello = this._appService.carrello.filter(function(el) {
        return el.id !== item.id;
    });

  }

}