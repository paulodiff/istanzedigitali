import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-file',
  template: `<p>File...{{to.label}}</p>
    <input 
        type="file" 
        [formControl]="formControl" 
        [formlyAttributes]="field"
        [class.is-invalid]="showError"
        accept="{{to.permittedExtension}}"
        >
  `,
})
export class FormlyFieldFile extends FieldType {}