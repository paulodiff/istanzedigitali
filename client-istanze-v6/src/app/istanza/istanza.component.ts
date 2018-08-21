import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';


import { AppService } from '../services/app.service';

@Component({
    templateUrl: './istanza.component.html'
})

export class IstanzaComponent implements OnInit, OnDestroy {

    public name = 'IstanZA Informazioni di Log';
    public items: any;
    public istanzaId;
    public tableName;

    public form = new FormGroup({});

    public  model = {
    lastName: 'Smith',
  };

  public  options: FormlyFormOptions = {};

  public  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      defaultValue: 'This is a default value',
      templateOptions: {
        label: 'First Name (initialized via default value)',
      },
    },
    {
      key: 'lastName',
      type: 'input',
      defaultValue: 'This is a default value',
      templateOptions: {
        label: 'Last Name (initialized via the model)',
      },
    },
    {
      key: 'candy',
      type: 'select',
      defaultValue: 'milky_way',
      templateOptions: {
        label: 'Favorite Candy (initialized via default value',
        options: [
          { label: 'Snickers', value: 'snickers' },
          { label: 'Baby Ruth', value: 'baby_ruth' },
          { label: 'Milky Way', value: 'milky_way' },
        ],
      },
    },
    {
      key: 'agree',
      type: 'checkbox',
      templateOptions: {
        label: 'Agree? (not initialized at all)',
        required: true,
      },
    },
  ];

  submit() {
    alert(JSON.stringify(this.model));
  }


  constructor(
              private route: ActivatedRoute,
              private _appService: AppService
            ) {}

  ngOnInit() {

    this.istanzaId = this.route.snapshot.paramMap.get('istanzaId');
    this.tableName = this.route.snapshot.paramMap.get('tableName');

    if (this.istanzaId) {
      console.log(this.istanzaId);
      // this.name = this.name + ' registrazione numero: ' +  this.istanzaId;
      // let opts = {tblName : this.tableName, tblId : this.istanzaId };
      /*
      this._appService.getLogs(opts).subscribe(
        data => { 
          console.log(data);
          this.items = data;
        },
        err => console.log(err),
        () => console.log('ATTI:getLogs')
      );
      */
    }

    /*
    this.connection = this._socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
    */
  }

  ngOnDestroy() {
    // this.connection.unsubscribe();
  }

}