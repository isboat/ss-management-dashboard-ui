import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { DeviceService } from 'app/services/device.service';
import { DeviceModel } from 'app/models/device-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';
import { NotificationsService } from 'app/notifications';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  listData: DeviceModel[] = null;
  screens: ScreenModel[] = null;

  tmpScreenSelection = [];

  constructor(
    private deviceService: DeviceService,
    private dataService: DataService,
    private authService: AuthService,
    private notificationService: NotificationsService) { }

  ngOnInit() {
    this.fetchListData();
    this.fetchScreenList();
  }

  fetchScreenList() {
    this.dataService.fetchScreens().subscribe(
      {
        next: (data) => this.screens = data,
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

  fetchListData() {
    this.deviceService.fetchDevices().subscribe(
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

  update(device: DeviceModel) {
    if(!device) return;

    this.deviceService.updateName(device.id, device.deviceName).subscribe(
      {
        next: (data) => { device.editName = false;},
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

  onScreenChange(evt, deviceId) {
    const newScreenId = evt.target.value;
    if(!newScreenId) return;
    var selection = this.tmpScreenSelection.find(x => x.deviceId === deviceId);
    if (selection) {
      selection.screenId = newScreenId;
    }
    else {
      this.tmpScreenSelection.push({ deviceId: deviceId, screenId: newScreenId })
    }
  }

  updateDeviceScreen(deviceId: string) {
    var selection = this.tmpScreenSelection.find(x => x.deviceId === deviceId);
    if (selection) {
      if(selection.screenId == "none") selection.screenId = "";
      this.deviceService.updateScreen(selection.deviceId, selection.screenId).subscribe(
        {
          next: (data) => { this.notificationService.showSuccess("Successfully set screen to device")},
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

  deleteDevice(deviceId: string) {
    if (deviceId) {
      this.deviceService.deleteScreen(deviceId).subscribe(
        {
          next: (data) => {
            this.listData = this.listData.filter(x => x.id != deviceId)
            this.notificationService.showSuccess("Successfully deleted device")
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

}
