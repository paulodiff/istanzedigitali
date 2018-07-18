import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'formly-field-input',
 template: `
   <input type="input" [formControl]="formControl" [formlyAttributes]="field" class="form-control">
 `,
})
export class FormlyFieldInput extends FieldType {}