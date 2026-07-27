import { Component, computed, OnInit, signal } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';
import { AuthService } from 'app/services/auth.service';
import { NotificationsService } from 'app/notifications';
import { appconstants } from 'app/helpers/constants';
import { DeviceService } from 'app/services/device.service';
import { DeviceModel } from 'app/models/device-response.model';

@Component({
  standalone: false,
  selector: 'app-screen-list',
  templateUrl: './screen-list.component.html',
  styleUrls: ['./screen-list.component.css']
})
export class ScreenListComponent implements OnInit {

  readonly listData = signal<ScreenModel[]>([]);
  readonly isAdminUser = signal(false);
  readonly devices = signal<DeviceModel[]>([]);
  readonly selectedScreen = signal<ScreenModel | null>(null);
  readonly selectedDeviceId = signal<string | null>(null);
  readonly deviceIdForPublish = computed(() => {
    const selectedDeviceId = this.selectedDeviceId();
    if (selectedDeviceId) return selectedDeviceId;

    const selectedScreen = this.selectedScreen();
    return this.devices().find(device => device.screenId === selectedScreen?.id)?.id ?? null;
  });

  constructor(
    private auth: AuthService,
    private deviceService: DeviceService,
    private dataService: DataService, private authService: AuthService, private notification: NotificationsService) { }

  ngOnInit() {
    this.isAdminUser.set(this.auth.isAdminUser());
    this.fetchListData();
    this.fetchDevices();
  }

  onSelectScreen(screen: ScreenModel){
    this.selectedScreen.set(screen);
    this.selectedDeviceId.set(null);
  }
  
  onDeviceSelect(evt: any) {
    this.selectedDeviceId.set(evt.target.value);
  }

  fetchDevices() {
    this.deviceService.fetchDevices().subscribe({
      next: (data) => {
        this.devices.set(data);
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchListData() {
    this.dataService.fetchScreens(this.listData().length, appconstants.fetchLimit).subscribe(
      {
        next: (data) => this.listData.update(screens => [...screens, ...data]),
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  goToPreviewSite(screenId: string) {
    window.open(`http://localhost:4401/?screenId=${screenId}&token=${this.authService.getAuthorizationToken()}`, "newwindow", 'width=1100,height=850');
  } 

  publishScreen(id: string) {
    this.dataService.publishScreen(id).subscribe(
      {
        next: () => {
          this.notification.showSuccess("PUBLISHED..")

          this.deviceService.linkToDevice(this.deviceIdForPublish(), id, this.devices());
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  deleteScreen(id: string) {
    this.dataService.deleteScreen(id).subscribe(
      {
        next: () => {
          this.listData.update(screens => screens.filter(screen => screen.id !== id));
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

}
