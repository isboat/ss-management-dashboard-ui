import { Component, OnInit } from '@angular/core';
import { appconstants } from 'app/helpers/constants';
import { MenuModel } from 'app/models/menu-response.model';
import { AuthService } from 'app/services/auth.service';
import { MenuService } from 'app/services/menu.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {

  listData: MenuModel[] = [];

  constructor(private dataService: MenuService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchListData();
  }

  fetchListData(){
    this.dataService.fetchMenus(this.listData.length, appconstants.fetchLimit).subscribe(
      {
        next: (data) => this.listData.push(...data),
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

 deleteMenu(id: string)
 {
  this.dataService.deleteMenu(id).subscribe(
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
