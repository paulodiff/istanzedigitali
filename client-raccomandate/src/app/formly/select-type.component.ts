import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
 selector: 'formly-field-select',
 template: `
   <input type="input" [formControl]="formControl" [formlyAttributes]="field" class="form-control">
 `,
})
export class FormlyFieldSelect extends FieldType {}