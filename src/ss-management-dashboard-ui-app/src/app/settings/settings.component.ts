import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TenantModel } from 'app/models/tenant-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { TenantService } from 'app/services/tenant.service';

@Component({
  standalone: false,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private sub: any;

  readonly data = signal<TenantModel | null>(null);
  readonly isAdminUser = signal(false);
  readonly allowToView = computed(() => this.isAdminUser());
  readonly saving = signal(false);
  readonly updatingPermission = signal(false);

  constructor(
    private dataService: TenantService, 
    private authService: AuthService,
    private notification: NotificationsService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.fetchData();
      this.isAdminUser.set(this.authService.isAdminUser());
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fetchData() {
    this.dataService.fetchSettings().subscribe({
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
    this.saving.set(true);
    this.dataService.saveUpdates(data).subscribe(
      {
        next: () => 
        {
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

  updatePermission() { 
    const data = this.data();
    if (!data) return;
    this.updatingPermission.set(true);
    this.dataService.updatePartnerPermission(data.allowedPartnerPermission).subscribe(
      {
        next: () => 
        {
          this.notification.showSuccess('Permission Updated.')
        },
        error: (e) => {
          this.updatingPermission.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.updatingPermission.set(false)
      });
  }
}
