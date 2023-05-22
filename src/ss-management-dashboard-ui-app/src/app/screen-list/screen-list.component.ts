import { Component, OnInit } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-screen-list',
  templateUrl: './screen-list.component.html',
  styleUrls: ['./screen-list.component.css']
})
export class ScreenListComponent implements OnInit {

  listData: ScreenModel[] = null;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.fetchListData();
  }

  generateScreenPath(id: string): string {
    return  `/screens/${id}`;
  }

  fetchListData(){
    this.dataService.fetchScreens().subscribe(data => {
        this.listData = data;
    });
 }

}
