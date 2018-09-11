import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule, ValidationErrors, FormControl } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { FormlyModule, FormlyFieldConfig} from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { environment } from '../environments/environment';
import { routing } from './app.routes';

import { ToastrModule } from 'ngx-toastr';
// import { SseEventService } from './services/sseevent.service';
// import { SocketService } from './services/socket.service';
// import { ReportService } from './services/report.service';

import { AppService } from './services/app.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { NotificationService } from './services/notification.service';
import { RequestInterceptor } from './services/http-interceptor.service';

import { AppComponent } from './app.component';
import { IstanzaComponent } from './istanza/istanza.component';
import { ErrorsComponent } from './errors/errors.component';

import { FileValueAccessor } from './file-value-accessor';
import { FormlyFieldFile } from './file-type.component';

// upload https://github.com/bleenco/ngx-uploader
import { NgxUploaderModule } from 'ngx-uploader';

// mgx-formly validation custom message

export function minlengthValidationMessage(err, field) {
  return `Should have atleast ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export function IpValidator(control: FormControl): ValidationErrors {
  return !control.value || /(\d{1,3}\.){3}\d{1,3}/.test(control.value) ? null : { 'ip': true };
}

export function IpValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid IP Address`;
}

// "^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$"

export function dataGG_MM_AAAA_Validator(control: FormControl): ValidationErrors {
  return !control.value || /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/.test(control.value) ? null : { 'dataGG_MM_AAAA': true };
}

export function dataGG_MM_AAAA_ValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid DATA GG_MM_AAAA`;
}

// "^[^@\s]+@[^@\s]+\.[^@\s]+$"

export function emailValidator(control: FormControl): ValidationErrors {
  return !control.value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(control.value) ? null : { 'email': true };
}

export function emailValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.formControl.value}" is not a valid __ EMAIL`;
}

// fileTypeSizeValidator
export function fileTypeSizeValidator(control: FormControl): ValidationErrors {
  console.log('fileTypeSizeValidator:', control.value);
  if (!control.value) { return null; }
  console.log('check control.value', control.value);
  if (control.value[0]) {
    if (control.value[0].type !== 'application/pdf') {
      return  { 'fileTypeSize': true };
    }
  }
  return null;
  // return !control.value || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(control.value) ? null : { 'email': true };
}

export function fileTypeSizeValidatorMessage(err, field: FormlyFieldConfig) {
  console.log('fileTypeSizeValidatorMessage:', err);
  console.log('fileTypeSizeValidatorMessage:', field);
  return `Tipo o dimensione del file non valida`;
}


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUploaderModule,
    // FormlyModule.forRoot(),
    FormlyModule.forRoot({
      types: [
        { name: 'file', component: FormlyFieldFile, extends: 'input' },
      ],
      validators: [
        { name: 'ip', validation: IpValidator },
        { name: 'email', validation: emailValidator },
        { name: 'dataGG_MM_AAAA', validation: dataGG_MM_AAAA_Validator },
        { name: 'fileTypeSize', validation: fileTypeSizeValidator },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
        { name: 'ip', message: IpValidatorMessage },
        { name: 'dataGG_MM_AAAA', message: dataGG_MM_AAAA_ValidatorMessage },
        { name: 'email', message: emailValidatorMessage },
        { name: 'fileTypeSize', message: fileTypeSizeValidatorMessage }
      ],
    }),
    /*
    FormlyModule.forRoot({
      types: [
        { name: 'inputR', component: FormlyFieldInput,  wrappers: ['fieldset', 'label'] },
        {
          name: 'button',
          component: FormlyFieldButton,
          wrappers: ['fieldset', 'label'],
          defaultOptions: {
            templateOptions: {
              btnType: 'default',
              type: 'button',
            },
          },
        },
      ],
    }),
    */
    FormlyBootstrapModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    routing,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    })
  ],
  declarations: [
    AppComponent,
    IstanzaComponent,
    ErrorsComponent,
    FileValueAccessor,
    FormlyFieldFile
  ],
  providers: [
    AppService,
    // SocketService,
    // ReportService,
    NotificationService,
    ErrorHandlerService,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
