import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  template: `<div *ngFor="let message of messages">
                     {{message.text}}
                   </div>
                   <input [(ngModel)]="message"  /><button (click)="sendMessage()">Send</button>`
})

export class SocketComponent implements OnInit, OnDestroy {
  messages = [];
  connection;
  message;

  constructor(private _socketService: SocketService) {}

  sendMessage(){
    this._socketService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.connection = this._socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
  
}