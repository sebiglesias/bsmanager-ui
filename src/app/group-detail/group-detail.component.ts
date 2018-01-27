import { Component, OnInit } from '@angular/core';
import {GroupService} from '../group.service';
import {Group} from '../models';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.css']
})
export class GroupDetailComponent implements OnInit {

  group: Group;

  constructor(private groupService: GroupService, private num: number) { }

  ngOnInit() {
    this.groupService.getGroupByName(this.num).subscribe( g => {
      this.group = g;
    });
  }

}
