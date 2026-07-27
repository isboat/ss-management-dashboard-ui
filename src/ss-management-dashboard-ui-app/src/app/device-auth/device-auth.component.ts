import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { DeviceService } from 'app/services/device.service';
import { finalize } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'app-device-auth',
  templateUrl: './device-auth.component.html',
  styleUrls: ['./device-auth.component.css']
})
export class DeviceAuthComponent {

  constructor(
    private dataService: DeviceService,
    private notification: NotificationsService,
    private authService: AuthService,) { }

  readonly deviceAuthForm = new FormGroup({
    partOne: new FormControl('', { nonNullable: true, validators: this.codePartValidators() }),
    partTwo: new FormControl('', { nonNullable: true, validators: this.codePartValidators() }),
    partThree: new FormControl('', { nonNullable: true, validators: this.codePartValidators() }),
  });

  readonly showForm = signal(true);
  readonly submitting = signal(false);
  readonly attemptedSubmit = signal(false);
  private readonly formStatus = toSignal(this.deviceAuthForm.statusChanges, {
    initialValue: this.deviceAuthForm.status
  });
  readonly showCodeError = computed(() => this.attemptedSubmit() && this.formStatus() === 'INVALID');

  submit() {
    this.attemptedSubmit.set(true);
    this.deviceAuthForm.markAllAsTouched();
    if (this.deviceAuthForm.invalid || this.submitting()) {
      this.notification.showWarning("Enter all three four-character parts of the code");
      return;
    }
    const { partOne, partTwo, partThree } = this.deviceAuthForm.getRawValue();
    const data: DeviceAuthRequestModel = { userCode: `${partOne}-${partTwo}-${partThree}` };
    this.submitting.set(true);
    this.dataService.post(data).pipe(
      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: (data) => {
        this.showForm.set(false);
        this.notification.showSuccess('Success: TV App authenticated.');
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
        if (e.status == 404) this.notification.showWarning('NOT FOUND: Incorrect code, please update.')
        if (e.status == 400) {
          let message = "";
          const error = e.error;
          switch (error) {
            case "device_limit_reached":
              message = "You have reached the maximum allowed number of TV apps."
              break;
            case "already_approved":
              message = "You have already approved this app."
              break;
            default:
              break;
          }
          if (message) this.notification.showError(message)
        }
      }
    });
  }

  normalizeCodePart(controlName: 'partOne' | 'partTwo' | 'partThree'): void {
    const control = this.deviceAuthForm.controls[controlName];
    const normalized = control.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
    if (normalized !== control.value) control.setValue(normalized);
  }

  private codePartValidators() {
    return [Validators.required, Validators.pattern(/^[A-Za-z0-9]{4}$/)];
  }
}
