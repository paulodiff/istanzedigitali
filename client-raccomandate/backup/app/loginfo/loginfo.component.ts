import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { SocketService } from '../services/socket.service';
import { AppService } from '../services/app.service';

@Component({
    templateUrl: './loginfo.component.html'
})

export class LogInfoComponent implements OnInit, OnDestroy {

    public name = 'LogInfo Informazioni di Log';
    public items = [];
    connection;
    message;
  // form Consegna


  constructor(
              private route: ActivatedRoute,
              private _appService: AppService
            ) {}

  ngOnInit() {

    let id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log(id);
      this.name = this.name + ' registrazione numero: ' +  id;
      let opts = {tblName : 'rAtti', tblId : id };
      this._appService.getLogs(opts).subscribe(
        data => { 
          console.log(data);
          this.items = data;
        },
        err => console.log(err),
        () => console.log('ATTI:getLogs')
      );
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