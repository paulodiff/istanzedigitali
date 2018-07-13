import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EventSourcePolyfill } from 'ng-event-source';

import { environment } from '../../environments/environment';
import { v4 as uuid } from 'uuid';
// import * as EventSource from 'eventsource';

@Injectable()
export class SseEventService {
    // http options used for making API calls
    private httpOptions: any;

    // error messages received from the login attempt
    public errors: any = []; 
    public eventSource:any;
    public sseId: any;
    public obsEventSource: any;

    constructor(private http: HttpClient, private zone: NgZone) {
        this.httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
    }


    init(userName) {
        this.sseId = uuid();
        // let sseUrl = environment.apiSse + '/connect/' + this.sseId  + "/events";
        console.log('SSE:eventService:init');
        // console.log(sseUrl);

        console.log('SSE:create observable ..');

        this.obsEventSource = Observable.create((observer) => {
            this.sseId = userName;
            let sseUrl = environment.apiSse + '/connect/' + this.sseId  + "/events";
            console.log('SSE: ###### OBSERVABLE CREATED!');
            console.log(sseUrl);
            //let opts = {checkActivity: false, errorOnTimeout: false};
            const opts = {};
            const eventSource = new EventSourcePolyfill(sseUrl, opts);
            // let eventSource = new EventSource(sseUrl);
            eventSource.onmessage = (event) => {
                console.log(event);
                this.zone.run(() => observer.next(JSON.parse(event.data)));
            };
            eventSource.onerror = (error) => console.log(error);
        });

        console.log('SSE:eventService:observable:created!');

        /*
        //this.eventSource = new EventSourcePolyfill(environment.apiSse, {headers: { headerName: 'HeaderValue', header2: 'HeaderValue2' }});
        this.sseId = uuid();
        console.log('event.service:init' + this.sseId);
        let sseUrl = environment.apiSse + '/connect/' + this.sseId  + "/events";

        console.log(sseUrl);
        this.eventSource = new EventSourcePolyfill(sseUrl, {});
        this.eventSource.onmessage = (data => {
            console.log('event.service.onmessage', data);
            this.zone.run(() => {          console.log('event.service.onmessage.run');       });
        });

        this.eventSource.onopen = (a) => {
            console.log('event.service.onopen', a);
        };

        this.eventSource.onerror = (e) => {
            console.log('event.service.onerror', e);
        };
        */

    }

    getStatus() {
        console.log('SSE:getStatus');
        let sseUrl = environment.apiSse + '/status';
        return this.http.get(sseUrl);
    }

    /*
    getIndicatorsStream(): Observable<any> {
        return Observable.create((observer) => {
            this.sseId = uuid();
            let sseUrl = environment.apiSse + '/connect/' + this.sseId  + "/events";
            console.log('getIndicator');
            console.log(sseUrl);
            let eventSource = new EventSourcePolyfill(sseUrl, {});
            eventSource.onmessage = (event) => {
                this.zone.run(() => observer.next(JSON.parse(event.data)));
            };
            eventSource.onerror = (error) => observer.error(error);
      });
    }
    */
}