import { Component } from '@angular/core';

/**
 * Generated class for the FilterBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'filter-bar',
  templateUrl: 'filter-bar.html'
})
export class FilterBarComponent {

  text: string;

  constructor() {
    console.log('Hello FilterBarComponent Component');
    this.text = 'Hello World';
  }

}
