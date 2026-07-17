import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { LocalStorageService } from 'app/services/localstorage.service';
import { LoginService } from 'app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private tokenKey = 'token';
  constructor(
    private loginService: LoginService, 
    private localStorage: LocalStorageService, 
    private notificationService: NotificationsService,
    private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {
  }

  submit() {
    const email = this.loginForm.get('email').value;    
    const passwd = this.loginForm.get('password').value;
    this.loginService.login(email, passwd).subscribe({
      next: (tokenResponse) => {
        localStorage.setItem(this.tokenKey, tokenResponse.token);
        this.router.navigate(['/']);
      },
      error: (e) => {
        if(e.status == 401) {
          this.notificationService.showWarning("Incorrect login details, try again")
        }
        else {
          this.notificationService.showError(JSON.stringify(e));
        }
      }
    })
  }

}
