import { Component, OnInit } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
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
    this.dataService.fetchScreens().subscribe({
      next: (data) => this.listData = data,
      error: (e) => {
        if(e.status == 401) console.log("ERORR HERE:" + e)
      },
      complete: () => console.info('complete') 
    });
 }

}
