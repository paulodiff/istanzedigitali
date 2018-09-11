import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { startWith } from 'rxjs/operators/startWith';
import { filter } from 'rxjs/operators/filter';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'formly-field-typeahead',
  template: `
    <ng-select [items]="options$ | async"
      [bindLabel]="to.bindLabel"
      [bindValue]="to.bindValue"
      [placeholder]="to.placeholder"
      [typeahead]="search$"
      [formControl]="formControl">
    </ng-select>
    {{to.bindLabel}} {{to.bindValue}}
  `,
})
export class FormlyFieldTypeahead extends FieldType implements OnInit, OnDestroy {
  onDestroy$ = new Subject<void>();
  search$ = new EventEmitter();
  options$;

  ngOnInit() {
    console.log('tyOnInit');
    this.options$ = this.search$.pipe(
      takeUntil(this.onDestroy$),
      startWith(''),
      filter(v => v !== null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(this.to.search$),
    );
    this.options$.subscribe();
  }

  ngOnDestroy() {
    console.log('tyOnDestrory');
    this.onDestroy$.complete();
  }
}