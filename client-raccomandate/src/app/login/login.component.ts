// Import component decorator
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';


@Component({
    templateUrl: './login.component.html',
})

// Component class
export class LoginComponent implements OnInit, OnDestroy {
 

    constructor(public _userService: AppService) { }

    public user: any;
    public name: 'Login';
    public subscription: any;

    public form = new FormGroup({});
    public model: any = {};
    public options: FormlyFormOptions = {};
    public fields: FormlyFieldConfig[] = [
        // {template: '<div class="alert alert-success" role="alert">'},
        
        {
            fieldGroupClassName: 'row',
            fieldGroup: [ 
                {
                    className: 'col-6',
                    type: 'inputR',
                    key: 'userName',
                    templateOptions: {
                        label: 'User Name',
                    },
                },
                {
                    key: 'password',
                    className: 'col-6',
                    type: 'inputR',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'Password',
                        pattern: ''
                    },
                    validators: {
                        validation: Validators.compose([Validators.required])
                    }
                }
            ],
        } 
        //{template: '</div>B'}
    ];

    submitSearch() {
        alert(JSON.stringify(this.model));
    }

    submit(model) {
        console.log(this.model);
        this._userService.login({'username': this.model.username, 'password': this.model.password});
    }

    ngOnInit() {
        this.model = {
            username: 'prova',
            password: ''
        };

        console.log('LOGIN INIT ... ');

        /*
        this.subscription = this._sseEventService.getIndicatorsStream().subscribe({
            next: msg =>  { console.log('login observable '); console.log(msg); },
            error: err => console.error('something wrong occurred: ' + err)
          });
          */
        console.log('LOGIN subscribe to loginType event ... ');


    }

    ngOnDestroy() {
        console.log('LOGIN:ngOnDestroy:unsubscribe');
    }

    login() {
      this._userService.login({'username': this.model.username, 'password': this.model.password});
    }

    refreshToken() {
      this._userService.refreshToken();
    }

    logout() {
      this._userService.logout();
    }

    testSse(){

    }
}