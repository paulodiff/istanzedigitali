import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { environment } from '../environments/environment';

import { DogListComponent }  from './dogs/dog-list.component';
import { DogDetailsComponent }  from './dogs/dog-details.component';
import { LoginComponent }  from './login/login.component';
import { AttiListComponent }  from './atti/atti-list.component';
import { AttiNewComponent }  from './atti/atti-new.component';
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
    DogListComponent, 
    DogDetailsComponent,
    LoginComponent,
    SocketComponent,
    ConsegnaComponent,
    LogInfoComponent,
    FormlyFieldButton,
    FormlyFieldInput,
    FormlyFieldSelect
  ],
  providers: [ AppService, SocketService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
