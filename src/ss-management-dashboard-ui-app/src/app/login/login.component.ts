import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { LoginService } from 'app/services/login.service';
import { finalize } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isSigningIn = signal<boolean>(false);

  constructor(
    private loginService: LoginService, 
    private authService: AuthService,
    private notificationService: NotificationsService,
    private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  ngOnInit() {
  }

  submit() {
    if (this.isSigningIn()) {
      return;
    }

    this.isSigningIn = signal(true);
    const email = this.loginForm.get('email').value;    
    const passwd = this.loginForm.get('password').value;
    this.loginService.login(email, passwd).pipe(
      finalize(() => this.isSigningIn = signal(false))  
    ).subscribe({
      next: (tokenResponse) => {
        this.authService.setAuthorizationToken(tokenResponse.token);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.isSigningIn = signal(false);
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
