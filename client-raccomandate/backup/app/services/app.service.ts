import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
 
// https://www.metaltoad.com/blog/angular-5-making-api-calls-httpclient-service

/*
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
*/



@Injectable()
export class AppService {
    // http options used for making API calls
    private httpOptions: any;
    
    // the actual JWT token
    public token: string;

    // the token expiration date
    public token_expires: Date;

    // the username of the logged in user
    public username: string;

    public carrello: any = []; 

    // error messages received from the login attempt
    public errors: any = []; 
    configUrl = 'https://jsonplaceholder.typicode.com/users';
    constructor(private http:HttpClient) {

      console.log('APP_SERVICE:build');

      this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

        // TO REMOVE
      this.username = "USER_TEST";
    }


    getAtti(options) {
        // Begin assigning parameters
        let Params = new HttpParams();
        console.log(options);
        console.log(environment.apiAtti);
        Params = Params.append('dataricerca', options.dataricerca);
        Params = Params.append('nominativo', options.nominativo);
        Params = Params.append('cronologico', options.cronologico);
        Params = Params.append('maxnumrighe', options.maxnumrighe);
        console.log(JSON.stringify(options));
        return this.http.get(environment.apiAtti, { params: Params, headers: this.httpOptions } );
    }

    saveAtti(options) {
        // Begin assigning parameters
        console.log('APP_SERVICE:saveAtti');
        let Params = new HttpParams();
        console.log(options);

        let nominativo = options.nominativo ? options.nominativo : '';
        options.nominativo = nominativo.toUpperCase();

        Params = Params.append('nominativo', nominativo);
        Params = Params.append('cronologico', options.cronologico);
        Params = Params.append('maxnumrighe', options.maxnumrighe);
        // console.log(JSON.stringify(options));
        return this.http.post(environment.apiAtti, JSON.stringify(options), this.httpOptions );
    }

    updateConsegnaAtti(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:updateConsegnaAtti');
      let Params = new HttpParams();
      console.log(options);
      options.action = 'updateConsegna';
      Params = Params.append('id', options.id);
      Params = Params.append('nominativo', options.nominativo);
      Params = Params.append('estremidocumento', options.estremidocumento);
      Params = Params.append('note', options.note);
      // console.log(JSON.stringify(options));
      return this.http.put(environment.apiAtti, JSON.stringify(options), this.httpOptions );
    }

    updateAtti(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:updateAtti');
      let Params = new HttpParams();
      console.log(options);
      options.action = 'updateAtto';
      // console.log(JSON.stringify(options));
      return this.http.put(environment.apiAtti, JSON.stringify(options), this.httpOptions );
    }

    getLogs(options) {
      // get info log di una registrazione
      console.log('APP_SERVICE:getLogs');
      let Params = new HttpParams();
      Params = Params.append('tblName', options.tblName);
      Params = Params.append('tblId', options.tblId);
      console.log(options);
      // console.log(JSON.stringify(options));
      return this.http.get(environment.apiInfoLog, { params: Params, headers: this.httpOptions } );
    }

  // generate a random user id
  public fakeLogin() {
    this.username = ('M' + Math.random() * (10000) + 10000).substring(0, 5);
    console.log(this.username);
  }

    // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
      this.http.post('/api-token-auth/', JSON.stringify(user), this.httpOptions).subscribe(
        data => {
          this.updateData(data['token']);
        },
        err => {
              console.log(err);
              this.errors = err['message'];
        }
      );
   }

    // Refreshes the JWT token, to extend the time the user is logged in
    public refreshToken() {
      this.http.post('/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
        data => {
          this.updateData(data['token']);
        },
        err => {
          this.errors = err['error'];
        }
      );
    }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  getStatus() {
    console.log('APP_SERVICE:getStatus');
    let sseUrl = environment.apiInfo;
    console.log(sseUrl);
    return this.http.get(sseUrl);
  }

}