import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-button',
  template: `
    <div>
      <button [type]="to.type" [ngClass]="to.btnType" (click)="onClick($event)">
        {{ to.text }}
      </button>
    </div>
  `,
})
export class FormlyFieldButton extends FieldType {
  onClick($event) {
    if (this.to.onClick) {
      this.to.onClick($event);
    }
  }
}


/**  
 * <button [type]="to.type" [ngClass]="'btn btn-block btn-' + to.btnType" (click)="onClick($event)">
 * 
 * Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */