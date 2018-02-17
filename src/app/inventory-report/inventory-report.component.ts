import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DataTableDirective} from 'angular-datatables';
import {Group, Product} from '../models';

@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})
export class InventoryReportComponent implements OnInit {

  products: Product[] = [];

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  groups: Group[];
  constructor() { }

  public ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      dom: 'Bfrtip',
      buttons: [
        'columnsToggle',
        'excel',
        {
          text: 'Some button',
          key: '1',
          action: function (e, dt, node, config) {
            alert('Button activated');
          }
        }
      ],
      pageLength: 2
    };
  }
}
