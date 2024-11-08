import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantModel } from 'app/models/tenant-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { TenantService } from 'app/services/tenant.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private sub: any;

  data: TenantModel = null;

  isAdminUser = false;

  constructor(
    private dataService: TenantService, 
    private authService: AuthService,
    private notification: NotificationsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.fetchData();
      this.isAdminUser = this.authService.isAdminUser();
    });
  }

  get allowToView()
  {
    return this.isAdminUser;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchSettings().subscribe({
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
    this.dataService.saveUpdates(this.data).subscribe(
      {
        next: () => 
        {
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

  updatePermission() { 

    this.dataService.updatePartnerPermission(this.data.allowedPartnerPermission).subscribe(
      {
        next: () => 
        {
          this.notification.showSuccess('Permission Updated.')
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
        }
      });
  }
}
