import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DeviceService } from 'app/services/device.service';

@Component({
  standalone: false,
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

  readonly showForm = signal(true);
  readonly submitting = signal(false);

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
    this.submitting.set(true);
    this.dataService.post(data).subscribe({
      next: (data) => {
        this.showForm.set(false);
        this.notification.showSuccess('Success: TV App authenticated.');
      },
      error: (e) => {
        this.submitting.set(false);
        if (e.status == 401) this.authService.redirectToLogin(true);
        if (e.status == 404) this.notification.showWarning('NOT FOUND: Incorrect code, please update.')
        if (e.status == 400) {
          let message = "";
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
      complete: () => this.submitting.set(false)
    });
  }
}
