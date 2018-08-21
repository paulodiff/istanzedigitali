import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {
  private url = environment.apiSocket;
  private socket;

  constructor() {}

  sendMessage(message){
    console.log('SocketService:sendMessage');
    this.socket.emit('message', message);
  }

  getMessages(): Observable<any> {
    let observable = new Observable(observer => {

      this.socket = io(this.url);

      this.socket.on('message', (data) => {
        console.log('SocketService:getMessage:on');
        observer.next(data);
      });
      return () => {
        console.log('SocketService:socketDisconneted!');
        this.socket.disconnect();
      };
    })
    return observable;
  }
}