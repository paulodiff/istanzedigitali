import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppService } from './services/app.service';
// import { SseEventService } from './services/sseevent.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, OnDestroy {
  public items: Observable<any[]>;
  public sseEventBus$: any;

  constructor(public _userService: AppService) {
      console.log('AppComponent:start:EventService');
        // start event bus service - todo after logon
      this._userService.fakeLogin();
      console.log(this._userService.username);
      // this._sseEventService.init(this._userService.username);
        // this.items = db.collection('/items').valueChanges();
    

  }

  ngOnInit() {

    /*
    this.sseEventBus$ = this._sseEventService.obsEventSource.subscribe({
      next: msg =>  { 
          console.log('APP:event type check:' + msg.msgType); 
          if (msg.msgType == 'updateMessage') {
              console.log('ATTI - UPDATE  EVENT!');
              console.log(msg); 
              // this.updateListFromMessage(msg);
          }
      },
      error: err => console.error('ATTI:something wrong occurred: ' + err)
    });
    */

  }

  ngOnDestroy() {}

  showLoginInfo() {
    console.log('APP:shologinInfo');

    this._userService.getStatus().subscribe(
      data => { 
        console.log('APP: get getStatus SUCCESS!');
        console.log(data);
      },
      err => console.log(err),
      () => console.log('APP: .....')
    );

  }
}
