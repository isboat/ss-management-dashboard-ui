import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from 'app/models/user-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;

  data: UserModel = null;

  constructor(
    private dataService: UserService, 
    private authService: AuthService,
    private notification: NotificationsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }
  onRoleChange(evt: any) {
    const newRole = evt.target.value;
    this.data.role = newRole === "1" ? 1 : 0;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchUserDetails(this.id).subscribe({
      next: (data) => {
        this.data = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  saveUpdates() { 
    console.log(this.data);
    this.data.created = null;
    this.data.modifiedDate = null;
    this.dataService.saveUser(this.data).subscribe(
      {
        next: () => 
        {
          console.log("SAVED..")
          this.notification.showSuccess('Updated successfully.')
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
