import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appSelected]'
})
export class SelectedDirective {

  constructor(element: ElementRef) {
    element.nativeElement.style.backgroundColor = '#00e600';
    element.nativeElement.style.color = 'white';
  }

}
