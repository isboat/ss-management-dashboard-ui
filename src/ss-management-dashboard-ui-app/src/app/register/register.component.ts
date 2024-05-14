import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { LocalStorageService } from 'app/services/localstorage.service';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private tokenKey = 'token';
  constructor(
    private loginService: LoginService, 
    private localStorage: LocalStorageService, 
    private notificationService: NotificationsService,
    private router: Router) { }

    registerForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    postcode: new FormControl(''),
    country: new FormControl(''),
    telephone: new FormControl(''),
  });

  ngOnInit() {
  }

  submit() {
    const form = {
      name: this.registerForm.get('name').value,
      email: this.registerForm.get('email').value,
      address: this.registerForm.get('address').value,
      postcode: this.registerForm.get('postcode').value,
      country: this.registerForm.get('country').value,
      telephone: this.registerForm.get('telephone').value
    };

    if(!form.name || !form.email || !form.address || !form.postcode || !form.country || !form.telephone)
    {
      this.notificationService.showWarning("Please complete the form fully.");
      return;
    }

    this.loginService.register(form).subscribe({
      next: () => {
        this.notificationService.showSuccess("Registration form submitted successfully, one of the sales team members will be in touch with you.")
      },
      error: (e) => {
        this.notificationService.showError("Error occured while submitted the form, refresh the page and try again.");
      }
    })
  }

}
