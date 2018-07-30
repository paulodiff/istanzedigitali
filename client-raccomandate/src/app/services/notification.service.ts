import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ToastrService } from 'ngx-toastr';


import 'rxjs/add/operator/publish';


@Injectable()
export class NotificationService {

  private _notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this._notification.asObservable().publish().refCount();

  constructor(
    private _toastr: ToastrService
  ) {}

  notify(message) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }


  notifyError(message) {
    const title = message.title;
    const msg = message.message;
    this._toastr.error(msg, title);
  }


/*
  notify(message) {
    this._notification.next(message);
    setTimeout(() => this._notification.next(null), 3000);
  }
*/

}