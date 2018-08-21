import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { FormlyModule } from '@ngx-formly/core';
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

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
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
    ErrorsComponent
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
