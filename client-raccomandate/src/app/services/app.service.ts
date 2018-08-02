import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { shareReplay, map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LookupResponse, LookupObject } from './lookup-interface';
 
// https://www.metaltoad.com/blog/angular-5-making-api-calls-httpclient-service

/*
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
*/

const CACHE_SIZE = 1;

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
    public isAdmin: Boolean;

    public carrello: any = [];
    public errorMsg: {};

    // error messages received from the login attempt
    public errors: any = [];
    configUrl = 'https://jsonplaceholder.typicode.com/users';
    constructor(private http: HttpClient) {

      console.log('APP_SERVICE:build');

      this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
      };

        // TO REMOVE
      this.username = 'USER_TEST';
    }

 
    // --------------------- ATTI ---------------------------------

    private cacheConsegnatari$: Observable<Array<LookupObject>>;
    private cacheDestinatari$: Observable<Array<LookupObject>>;

    private cacheConsegnatari: any[];

    get consegnatariPromise() {
      console.log('APP_SERVICE:consegnatariPromise ...');
      if (!this.cacheConsegnatari) {
        console.log('APP_SERVICE:consegnatari:RELOAD CACHE!');
        // this.person = this.http.get("https://jsonplaceholder.typicode.com/posts/1").map(res => res.json()).toPromise()
        this.http.get<any>(environment.apiAttiConsegnatari, { headers: this.httpOptions.headers } )
        // .pipe(map(res => res.json()))
        .toPromise()
        .then((data: any) => {
          /* tslint:disable:no-console */
          console.time('request-length');
          console.log(data);
          console.timeEnd('request-length');
          this.cacheConsegnatari = data;
        });
      }
      return this.cacheConsegnatari;
    }


    get consegnatari() {
        console.log('APP_SERVICE:consegnatari ...');
        return this.http.get<any>(environment.apiAttiConsegnatari, { headers: this.httpOptions.headers } );
        /*
        if (!this.cacheConsegnatari$) {
          console.log('APP_SERVICE:consegnatari:RELOAD CACHE!');
          this.cacheConsegnatari$ = this.requestConsegnatari().pipe(
            // tap(val => console.log(`BEFORE MAP: ${val}`)),
            shareReplay(CACHE_SIZE)
          );
        }
        return this.cacheConsegnatari$;
        */
    }

    private requestConsegnatari() {
      console.log('req:', environment.apiAttiConsegnatari);
      // return this.http.get<any>(environment.apiAttiConsegnatari)
      console.log(this.httpOptions);
      return this.http.get<any>(environment.apiAttiConsegnatari, { headers: this.httpOptions.headers } );
      /*
      .pipe(
        tap(val => console.log(`BEFORE MAP: ${val}`)),
        map(response => response.value)
      );
      */
    }

    getAtti(options) {
        // Begin assigning parameters
        console.log('APP_SERVICE:getAtti');
        let Params = new HttpParams();
        console.log(options);
        console.log(environment.apiAtti);
        Params = Params.append('dataricerca', options.dataricerca);
        Params = Params.append('nominativo', options.nominativo);
        Params = Params.append('cronologico', options.cronologico);
        Params = Params.append('maxnumrighe', options.maxnumrighe);
        console.log(JSON.stringify(options));
        return this.http.get(environment.apiAtti, { params: Params, headers: this.httpOptions.headers } );
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

    getConsegna(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:getConsegna');
      let Params = new HttpParams();
      console.log(options);
      // Params = Params.append('dataricerca', options.dataricerca);
      Params = Params.append('id', options.id);
      Params = Params.append('order', options.maxnumrighe);
      console.log(JSON.stringify(options));
      console.log(environment.apiConsegna);
      return this.http.get(environment.apiConsegna, { params: Params, headers: this.httpOptions.headers } );
  }

    saveConsegna(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:saveConsegna');
      let Params = new HttpParams();
      console.log(options);

      // console.log(JSON.stringify(options));
      return this.http.post(environment.apiConsegna, JSON.stringify(options), this.httpOptions );
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
      return this.http.get(environment.apiInfoLog, { params: Params, headers: this.httpOptions.headers } );
    }

    // atticonsegnatari

    getAttiConsegnatari(options) {
      // get info log di una registrazione
      console.log('APP_SERVICE:getAttiConsegnatari');
      let Params = new HttpParams();
      Params = Params.append('tblName', options.tblName);
      Params = Params.append('tblId', options.tblId);
      // console.log(options);
      // console.log(JSON.stringify(options));
      return this.http.get(environment.apiAttiConsegnatari, { params: Params, headers: this.httpOptions.headers } );
    }

    /*
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
    */

    // --------------------- RACCOMANDATE ---------------------------------


    get destinatariRaccomandate() {
      console.log('APP_SERVICE:destinatariRaccomandate ...');
      return this.http.get<any>(environment.apiDestinatariRaccomandate, { params: {}, headers: this.httpOptions.headers } );
      /*
      if (!this.cacheDestinatari$) {
        console.log('APP_SERVICE:destinatariRaccomandate:RELOAD CACHE!');
        this.cacheDestinatari$ = this.requestDestinatariRaccomandate().pipe(
          // tap(val => console.log(`BEFORE MAP: ${val}`)),
          shareReplay(CACHE_SIZE)
        );
      }
      return this.cacheDestinatari$;
      */
    }

    private requestDestinatariRaccomandate() {
      console.log('requestDestinatariRaccomandate req:', environment.apiDestinatariRaccomandate);
      // return this.http.get<any>(environment.apiAttiConsegnatari)
      return this.http.get<any>(environment.apiDestinatariRaccomandate, { params: {}, headers: this.httpOptions.headers } );
    }

    getRaccomandate(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:getRaccomandate');
      let Params = new HttpParams();
      console.log(options);
      console.log(environment.apiRaccomandate);
      Params = Params.append('dataricerca', options.dataricerca);
      Params = Params.append('numero', options.numero);
      Params = Params.append('mittente', options.mittente);
      Params = Params.append('maxnumrighe', options.maxnumrighe);
      console.log(JSON.stringify(options));
      return this.http.get(environment.apiRaccomandate, { params: Params, headers: this.httpOptions.headers } );
  }

  saveRaccomandata(options) {
      // Begin assigning parameters
      console.log('APP_SERVICE:saveRaccomandata');
      let Params = new HttpParams();
      console.log(options);

      // console.log(JSON.stringify(options));
      return this.http.post(environment.apiRaccomandate, JSON.stringify(options), this.httpOptions );
  }

  updateRaccomandata(options) {
    // Begin assigning parameters
    console.log('APP_SERVICE:updateRaccomandata');
    let Params = new HttpParams();
    console.log(options);
    options.action = 'updateRaccomandata';
    // console.log(JSON.stringify(options));
    return this.http.put(environment.apiRaccomandate, JSON.stringify(options), this.httpOptions );
  }



    // --------------------- LOGIN / AUTH ---------------------------------

  // generate a random user id
  public fakeLogin() {
    // this.username = ('M' + Math.random() * (10000) + 10000).substring(0, 5);
    this.username = 'LOGIN';
    console.log(this.username);
  }

    // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
      this.http.post(environment.apiLogin, JSON.stringify(user), this.httpOptions).subscribe(
        data => {
          console.log('APP_SERVICE:login');
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
    this.username = 'LOGIN';
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    console.log('APP_SERVICE:updateData');
    console.log(token_decoded);
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.sub.name;
    // is admin
    this.isAdmin = token_decoded.sub.isAdmin;

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      })
    };

  }

  // STATISTICHE --------------------------------------------------------

  getStats(options) {
    // get info log di una registrazione
    console.log('APP_SERVICE:getStats');
    let Params = new HttpParams();
    Params = Params.append('anno', options.anno);
    // Params = Params.append('tblId', options.tblId);
    // console.log(options);
    // console.log(JSON.stringify(options));
    return this.http.get(environment.apiStats, { params: Params, headers: this.httpOptions.headers } );
  }

  getStatus() {
    console.log('APP_SERVICE:getStatus');
    const sseUrl = environment.apiInfo;
    console.log(sseUrl);
    return this.http.get(sseUrl, { headers: this.httpOptions });
  }

}