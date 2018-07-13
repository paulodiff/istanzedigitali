import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<div class="alert alert-primary" role="alert"><h5>{{name}}</h5></div>`
})
export class HelloComponent  {
  @Input() name: string;
}
