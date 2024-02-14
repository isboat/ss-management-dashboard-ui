import { Component, OnInit } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';
import { AuthService } from 'app/services/auth.service';
import { NotificationsService } from 'app/notifications';
import { appconstants } from 'app/helpers/constants';
import { DeviceService } from 'app/services/device.service';
import { DeviceModel } from 'app/models/device-response.model';

@Component({
  selector: 'app-screen-list',
  templateUrl: './screen-list.component.html',
  styleUrls: ['./screen-list.component.css']
})
export class ScreenListComponent implements OnInit {

  listData: ScreenModel[] = [];
  isAdminUser = false;
  devices: DeviceModel[] = [];
  selectedScreen: ScreenModel = null;
  selectedDeviceId: string = null;

  constructor(
    private auth: AuthService,
    private deviceService: DeviceService,
    private dataService: DataService, private authService: AuthService, private notification: NotificationsService) { }

  ngOnInit() {
    this.isAdminUser = this.auth.isAdminUser();
    this.fetchListData();
    this.fetchDevices();
  }

  onSelectScreen(screen: ScreenModel){
    this.selectedScreen = screen;
  }
  
  onDeviceSelect(evt: any) {
    this.selectedDeviceId = evt.target.value;
  }

  fetchDevices() {
    this.deviceService.fetchDevices().subscribe({
      next: (data) => {
        this.devices = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }

  fetchListData() {
    this.dataService.fetchScreens(this.listData.length, appconstants.fetchLimit).subscribe(
      {
        next: (data) => this.listData = data,
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

          // if user has selected, default to the preselected device
          if(!this.selectedDeviceId) {

            this.devices.forEach(x => {
              if(x.screenId == this.selectedScreen.id) this.selectedDeviceId = x.id;
            });
          }
          this.deviceService.linkToDevice(this.selectedDeviceId, this.selectedScreen.id, this.devices);
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
          this.listData.forEach((value, index) => {
            if (value.id == id) this.listData.splice(index, 1);
          });
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
