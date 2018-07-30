import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';


import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { environment } from '../environments/environment';

import { LoginComponent }  from './login/login.component';
import { AttiListComponent }  from './atti/atti-list.component';
import { AttiNewComponent }  from './atti/atti-new.component';
import { RaccomandateListComponent }  from './raccomandate/raccomandate-list.component';
import { RaccomandateNewComponent }  from './raccomandate/raccomandate-new.component';
import { ConsegnaListComponent }  from './consegna/consegna-list.component';
import { ConsegnaNewComponent }  from './consegna/consegna-new.component';
import { ErrorsComponent }  from './errors/errors.component';


import { SocketComponent }  from './socket/socket.component';
import { ConsegnaComponent }  from './consegna/consegna.component';
import { LogInfoComponent } from './loginfo/loginfo.component';

import { AppService } from './services/app.service';

import { FormlyFieldButton } from './formly/button-type.component';
import { FormlyFieldInput } from './formly/input-type.component';
import { FormlyFieldSelect } from './formly/select-type.component';

import { routing } from './app.routes';

import { ToastrModule } from 'ngx-toastr';
// import { SseEventService } from './services/sseevent.service';
import { SocketService } from './services/socket.service';
import { ReportService } from './services/report.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { NotificationService } from './services/notification.service';

import { RequestInterceptor } from './services/http-interceptor.service';


@NgModule({
  imports:      [ 
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    SocketComponent,
    ConsegnaComponent,
    LogInfoComponent,
    ErrorsComponent,
    FormlyFieldButton,
    FormlyFieldInput,
    FormlyFieldSelect
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
