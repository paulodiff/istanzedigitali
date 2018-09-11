// Import component decorator
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../services/app.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { of as observableOf } from 'rxjs/observable/of';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
    templateUrl: './test.component.html',
})

// Component class
export class TestComponent implements OnInit, OnDestroy {
 

    constructor(public _userService: AppService) { }

    public user: any;
    public name: 'Login';
    public subscription: any;
    public people$: any;
    public selectedPersonId: any;

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
                    key: 'username',
                    templateOptions: {
                        label: 'Matricola',
                        placeholder: 'matricola'
                    },
                },
                {
                    key: 'password',
                    className: 'col-6',
                    type: 'input',
                    templateOptions: {
                        type: 'password',
                        label: 'Password',
                        placeholder: 'password'
                    }
                }
            ],
        }
    ];

    submitSearch() {
        alert(JSON.stringify(this.model));
    }

    submit(model) {
        console.log(this.model);
        this._userService.login(this.model);
    }

    ngOnInit() {
        this.model = {
            username: environment.testUserName,
            password: environment.testUserPassword
        };

        console.log('LOGIN INIT ... ');


        this.people$ = observableOf(states);

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

    displayCounter(count) {
        console.log('test component', count);
    }
}