import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from 'app/models/user-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';

@Component({
  standalone: false,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  readonly id = signal('');
  private sub: any;

  readonly data = signal<UserModel | null>(null);
  rolesOption: string[] = ["Editor", "Admin"]

  readonly isAdminUser = signal(false);
  readonly passwdUpdateModel = signal({ currentPasswd: '', newPassword: '' });
  readonly saving = signal(false);
  readonly updatingPassword = signal(false);
  readonly resettingPassword = signal(false);
  readonly allowToView = computed(() => {
    const data = this.data();
    return this.isAdminUser() || !!data && this.authService.authUserEmail() === data.email;
  });
  readonly isCurrentUserView = computed(() => {
    const data = this.data();
    return !!data && this.authService.authUserEmail() === data.email;
  });

  constructor(
    private dataService: UserService, 
    private authService: AuthService,
    private notification: NotificationsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.id.set(params['id']);
      this.fetchData();

      this.isAdminUser.set(this.authService.isAdminUser());
    });
  }

  onRoleChange(evt: any) {
    const newRole = evt.target.value;
    this.data.update(data => data ? { ...data, role: newRole === "1" ? 1 : 0 } : data);
  }

  updatePasswordField(field: 'currentPasswd' | 'newPassword', value: string): void {
    this.passwdUpdateModel.update(password => ({ ...password, [field]: value }));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchUserDetails(this.id()).subscribe({
      next: (data) => {
        this.data.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }

  saveUpdates() { 
    const data = this.data();
    if (!data) return;
    const updatedData = { ...data, created: null, modifiedDate: null };
    this.saving.set(true);
    this.dataService.saveUser(updatedData).subscribe(
      {
        next: () => 
        {
          console.log("SAVED..")
          this.notification.showSuccess('Updated successfully.')
        },
        error: (e) => {
          this.saving.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.saving.set(false)
      });
  }

  updatePasswd() { 
    const password = this.passwdUpdateModel();
    const data = this.data();
    if (!data) return;
    if(!password.newPassword || !password.currentPasswd)
    {
      this.notification.showWarning("Both Current password and new password fields must be completed")
      return;
    }
    this.updatingPassword.set(true);
    this.dataService.updatePasswd(data.id, password).subscribe(
      {
        next: () => 
        {
          this.notification.showSuccess('Updated password successfully.')
        },
        error: (e) => {
          this.updatingPassword.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.updatingPassword.set(false)
      });
  }

  resetPasswd() { 
    const data = this.data();
    if (!data) return;
    this.resettingPassword.set(true);
    this.dataService.resetPasswd(data.id).subscribe(
      {
        next: () => 
        {
          this.notification.showSuccess('Password reset successfully.')
        },
        error: (e) => {
          this.resettingPassword.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.resettingPassword.set(false)
      });
  }

}
