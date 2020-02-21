import { Directive } from '@angular/core';
import { MatInput } from '@angular/material';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective {

  constructor(private matInput: MatInput) { }

  ngOnInit() {
    setTimeout(() => this.matInput.focus());
  }
  
}
