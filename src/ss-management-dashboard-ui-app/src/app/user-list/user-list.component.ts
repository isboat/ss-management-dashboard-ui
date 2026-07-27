import { Component, OnInit, signal } from '@angular/core';
import { UserModel } from 'app/models/user-response.model';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  readonly listData = signal<UserModel[]>([]);
  readonly isAdminUser = this.authService.adminUser;

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchListData();

  }

  fetchListData(){
    this.userService.fetchUsers().subscribe(
      {
        next: (data) => this.listData.set(data),
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
        this.listData.update(items => items.filter(item => item.id !== id));
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
