import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
    selector: 'app-child',
    template: `<button class='btn btn-primary' (click)="valueChanged()">Click me {{btnName}}</button> `
})
export class AppChildComponent {
    @Input() btnName: string;
    @Output() valueChange = new EventEmitter();
    counter = 0;
    valueChanged() { // You can give any function name
        this.counter = this.counter + 1;
        console.log('app child value change', this.counter, this.btnName);
        this.valueChange.emit(this.counter);
    }
}