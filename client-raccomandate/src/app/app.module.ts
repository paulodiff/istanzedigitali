import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { environment } from '../environments/environment';

import { LoginComponent } from './login/login.component';
import { AttiListComponent } from './atti/atti-list.component';
import { AttiNewComponent } from './atti/atti-new.component';
import { RaccomandateListComponent } from './raccomandate/raccomandate-list.component';
import { RaccomandateNewComponent } from './raccomandate/raccomandate-new.component';
import { ConsegnaListComponent } from './consegna/consegna-list.component';
import { ConsegnaNewComponent } from './consegna/consegna-new.component';
import { ErrorsComponent } from './errors/errors.component';
import { StatsListComponent } from './stats/stats-list.component';


import { SocketComponent } from './socket/socket.component';
import { ConsegnaComponent } from './consegna/consegna.component';
import { LogInfoComponent } from './loginfo/loginfo.component';

import { TestComponent } from './test/test.component';
import { AppChildComponent } from './test/appchild.component';

import { AppService } from './services/app.service';

import { FormlyFieldButton } from './formly/button-type.component';
import { FormlyFieldInput } from './formly/input-type.component';
import { FormlyFieldSelect } from './formly/select-type.component';
import { FormlyFieldTypeahead } from './formly/typeahead-type.component';
import { FormlyFieldNgSelect } from './formly/ng-select-type.component';

import { routing } from './app.routes';

import { ToastrModule } from 'ngx-toastr';
// import { SseEventService } from './services/sseevent.service';
import { SocketService } from './services/socket.service';
import { ReportService } from './services/report.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { NotificationService } from './services/notification.service';

import { RequestInterceptor } from './services/http-interceptor.service';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormlyModule.forRoot({
      types: [
        { name: 'ng-select-formly', component: FormlyFieldNgSelect, wrappers: ['fieldset', 'label'] },
        { name: 'typeahead', component: FormlyFieldTypeahead, wrappers: ['fieldset', 'label'] },
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
    HelloComponent,
    AttiListComponent,
    AttiNewComponent,
    RaccomandateListComponent,
    RaccomandateNewComponent,
    ConsegnaListComponent,
    ConsegnaNewComponent,
    LoginComponent,
    TestComponent,
    AppChildComponent,
    SocketComponent,
    ConsegnaComponent,
    LogInfoComponent,
    ErrorsComponent,
    StatsListComponent,
    FormlyFieldButton,
    FormlyFieldInput,
    FormlyFieldSelect,
    FormlyFieldTypeahead,
    FormlyFieldNgSelect
  ],
  providers: [
    AppService,
    SocketService,
    ReportService,
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
  bootstrap:  [ AppComponent ]
})
export class AppModule { }
