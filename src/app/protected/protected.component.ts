import { Component } from '@angular/core';

@Component({
  selector: 'app-secure',
  template: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent {
  message;

  constructor() {
    this.message = 'Protected endpoint!';
  }
}
