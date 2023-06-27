import { Component, OnInit } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-screen-list',
  templateUrl: './screen-list.component.html',
  styleUrls: ['./screen-list.component.css']
})
export class ScreenListComponent implements OnInit {

  listData: ScreenModel[] = null;

  constructor(private dataService: DataService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchListData();
  }

  fetchListData(){
    this.dataService.fetchScreens().subscribe(
      {
        next: (data) => this.listData = data,
        error: (e) => {
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
 }

 deleteScreen(id: string)
 {
  this.dataService.deleteScreen(id).subscribe(
    {
      next: () => 
      {
        this.listData.forEach((value,index)=>{
          if(value.id==id) this.listData.splice(index,1);
      });
      },
      error: (e) => {
        if(e.status == 401) 
        {
          this.authService.redirectToLogin(true);
        }
        else
        {
          console.log(e)
        }
      },
      complete: () => console.info('complete')
    });
 }

}
