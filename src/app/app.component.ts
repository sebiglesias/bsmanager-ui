import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  router;

  constructor(router: Router, ) {
    this.router = router;
  }
  title = 'Business Manager';
}
