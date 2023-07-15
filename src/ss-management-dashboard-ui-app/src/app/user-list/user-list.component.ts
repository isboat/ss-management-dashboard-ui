import { Component, OnInit } from '@angular/core';
import { UserModel } from 'app/models/user-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  listData: UserModel[] = null;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchListData();
  }

  fetchListData(){
    this.userService.fetchUsers().subscribe(
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

 deleteUser(id: string)
 {
  this.userService.deleteUser(id).subscribe(
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
