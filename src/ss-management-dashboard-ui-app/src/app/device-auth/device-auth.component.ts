import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DeviceService } from 'app/services/device.service';

@Component({
  selector: 'app-screen',
  templateUrl: './device-auth.component.html',
  styleUrls: ['./device-auth.component.css']
})
export class DeviceAuthComponent implements OnInit {

  constructor(
    private dataService: DeviceService,
    private notification: NotificationsService,
    private authService: AuthService,) { }

  deviceAuthForm = new FormGroup({
    partOne: new FormControl(''),
    partTwo: new FormControl(''),
    partThree: new FormControl(''),
  });

  showForm: boolean = true;

  ngOnInit() {
  }

  submit() {
    const partOne = this.deviceAuthForm.get('partOne').value;
    const partTwo = this.deviceAuthForm.get('partTwo').value;
    const partThree = this.deviceAuthForm.get('partThree').value;
    if (!partOne || !partTwo || !partThree) {
      this.notification.showWarning("Enter all parts of the code");
      return;
    }
    const data: DeviceAuthRequestModel = { userCode: `${partOne}-${partTwo}-${partThree}` };
    this.dataService.post(data).subscribe({
      next: (data) => {
        this.showForm = false;
        this.notification.showSuccess('Success: TV App authenticated.');
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
        if (e.status == 404) this.notification.showWarning('NOT FOUND: Incorrect code, please update.')
        if (e.status == 400) {
          var message = "";
          const error = e.error;
          switch (error) {
            case "device_limit_reached":
              message = "You have reached the maximum allow number of TV apps"
              break;
            case "already_approved":
              message = "You have already approved this app."
              break;
            default:
              break;
          }
          if (message) this.notification.showError(message)
        }
      },
      complete: () => console.info('complete')
    });
  }
}
