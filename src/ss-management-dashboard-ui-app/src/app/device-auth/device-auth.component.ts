import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DeviceAuthRequestModel } from 'app/models/device-auth-request.model';
import { AuthService } from 'app/services/auth.service';
import { DeviceAuthService } from 'app/services/device-auth.service';

@Component({
  selector: 'app-screen',
  templateUrl: './device-auth.component.html',
  styleUrls: ['./device-auth.component.css']
})
export class DeviceAuthComponent implements OnInit {
  
  constructor(
    private dataService: DeviceAuthService, 
    private authService: AuthService,) { }

    deviceAuthForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {
  }

  submit() {
    const email = this.deviceAuthForm.get('email').value;   
    const data: DeviceAuthRequestModel = { userCode: email};
    this.dataService.post(data).subscribe({
      next: (data) => {
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      },
      complete: () => console.info('complete')
    });
  }
}
