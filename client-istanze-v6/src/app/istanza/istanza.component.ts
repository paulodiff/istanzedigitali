import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/partition';
import { from, merge } from 'rxjs';
import { partition, map, tap, pluck } from 'rxjs/operators';


import { AppService } from '../services/app.service';

import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';

interface Person {
  firstName: string;
  lastName: string;
}

@Component({
    templateUrl: './istanza.component.html'
})



export class IstanzaComponent implements OnInit, OnDestroy {


  upOptions: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;




  public name = 'IstanZA Informazioni di Log';
  public items: any;
  public istanzaId;
  public tableName;

  public form = new FormGroup({});

  public  model = {
    lastName: 'Smith',
  };

  public  options: FormlyFormOptions = {};

  public  fields: FormlyFieldConfig[] = [
    {
      key: 'firstName',
      type: 'input',
      defaultValue: 'NAME',
      templateOptions: {
        label: 'First Name (ip address 1.1.1.1)',
        required: true
      },
      validators: {
        validation: ['ip'],
      },
    },
    {
      key: 'lastName',
      type: 'input',
      defaultValue: 'LAST',
      templateOptions: {
        label: 'Last Name (initialized via the model)',
      },
    },

    {
      key: 'file_01',
      type: 'file',
      templateOptions: {
        label: 'File 01 ___ required',
        permittedExtension : '.pdf,.xml',
        required: true
      },
      validators: {
        validation: ['fileTypeSize']
      },
    },
    {
      key: 'file_02',
      type: 'file',
      validators: {
        validation: ['fileTypeSize']
      }
    }

   ];

  submit() {
    alert(JSON.stringify(this.model));
  }

  searchTerm$ = new Subject<string>();


  constructor(
              private route: ActivatedRoute,
              private _appService: AppService
            ) 
  {
    this.upOptions = { concurrency: 1, maxUploads: 3 };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {


    this.search(this.searchTerm$)
      .subscribe(results => {
        //console.log(results);
        //this.results = results.results;
    });

    this.onChanges();

    this.istanzaId = this.route.snapshot.paramMap.get('istanzaId');
    this.tableName = this.route.snapshot.paramMap.get('tableName');

    if ( localStorage.getItem('formTmp') ) {
      console.log('--> restore form value ..');
      console.log(JSON.parse(localStorage.getItem('formTmp')));
      this.form.patchValue(JSON.parse(localStorage.getItem('formTmp')));
    }

  // JSON.parse(localStorage.getItem('key'));

    /*
    if (this.istanzaId) {
      console.log(this.istanzaId);
      // this.name = this.name + ' registrazione numero: ' +  this.istanzaId;
      const opts = {istanzaId : this.istanzaId };
      this._appService.getInfoIstanza(opts).subscribe(
        data => {
          console.log(data);
          let my_data: any;
          my_data = data;
          // $scope.vm.fields =  response.data.vm_fields;         
          // this.fields = JSON.parse(my_data.vm_fields, this._appService.functionReviver);
          this.fields = JSON.parse(my_data.vm_fields);
          this.model =  my_data.vm_model;
        },
        err => console.log(err),
        () => console.log('Istanza:getInfoIstanza')
      );

    }
    */

    /*
    this.connection = this._socketService.getMessages().subscribe(message => {
      this.messages.push(message);
    })
    */
  }

  ngOnDestroy() {
    // this.connection.unsubscribe();
  }

  objMapFnInput(o) {
    return {
      firstName: o.firstName,
      lastName: o.lastName
    };
  }

  objMapFnFile(o) {
    return {
      file_01: o.file_01,
      file_02: o.file_02
    };
  }

  distinctCompareFn (p: any, q: any) {
    console.log(p);
    console.log(q);

    return  true;

  }

  // sottroscrive alle modifiche del form già filtrate
  onChanges(): void {

    /*
    var observers = this.form.valueChanges.pipe(
      tap(val => console.log(`BEFORE MAP: ${val}`)),
      partition( val => { val % 2 === 0 } )
    );
    

    // const [evens, odds] = this.form.valueChanges.pipe( tap( _ => console.log('ciao'));

    const subscribe = merge(
      evens.pipe(map(val => `Even: ${val}`)),
      odds.pipe(map(val => `Odd: ${val}`))
    ).subscribe(val => console.log(val))
    */

    
    this.form.valueChanges
    .pipe(
      tap( val => console.log('Before Map:', val)),
      // objMapFn get only input
      map( val => this.objMapFnInput(val) ),
      tap( val => console.log('After Map:', val))
    )
    .debounceTime(400)
    .distinctUntilChanged(this.distinctCompareFn(p,q))
    /*
    .distinctUntilChanged((p: any, q: any) => {
      console.log(p);
      console.log(q);
      if (p.firstName === q.lastName) { return false; }
      return true; })
      */
    .subscribe(val => {
      console.log('##---FIRED!--FN---- onChanges -------------');
      console.log(val);
      localStorage.setItem('formTmp', JSON.stringify(val));
    });

    /*
    this.form.valueChanges
    .pipe(
      tap(val => console.log('Before PLUCK:', val)),
      pluck('file_01'),
      tap(val => console.log('After PLUCK:', val))
    )
    .debounceTime(400)
    .distinctUntilChanged().subscribe(val => {
      console.log('##---FIRED!--F1---- onChanges -------------');
      console.log(val);
      // this.searchTerm$.next(val.firstName);
      // this.search(val.firstName);
    });
    */

  }

 
  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    // return this.http.get(this.baseUrl + this.queryUrl + term).map(res => res.json());
    console.log('GOOOO searchEntries', term);
    return term;
  }

  modelChange(ev) {
    console.log('--------- model change -------------');
    console.log(ev);
    console.log(this.form.valid);
  }


  // upload info

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://localhost:8009/live/uploadSync/DIN02',
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }


}